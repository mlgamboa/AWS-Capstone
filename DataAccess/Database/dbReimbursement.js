const AWS = require("aws-sdk");

const dbReimbursement = {
	getLatestDraftByEmpId,
	add,
	updateReimbursementAmount,
	updateReimbursementSubmitted,
};
module.exports = dbReimbursement;

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;

async function getLatestDraftByEmpId(empId) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			IndexName: "PK-GSI4_SK-index",
			KeyConditionExpression: "PK = :pk and GSI4_SK = :gsi4sk",
			ProjectionExpression: "amount, CTF_id, RMBRSMNT_id", // -- to filter out the output
			ExpressionAttributeValues: {
				":pk": `EMP#${empId}`,
				":gsi4sk": `EMP#${empId}#draft`,
			},
		};
		const singleResultArr = await dynamoDbClient.query(params).promise();

		let reimbursement = null;
		if (singleResultArr.Items.length === 1) {
			reimbursement = {
				totalReimbursementAmount: parseInt(
					singleResultArr.Items[0].amount
				),
				flexCutoffId: singleResultArr.Items[0].CTF_id,
				flexReimbursementId: singleResultArr.Items[0].RMBRSMNT_id,
			};
		}
		return reimbursement;
	} catch (error) {
		console.log(error);
	}
}

async function add(detail) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			Item: detail,
		};
		const singleResultArr = await dynamoDbClient.put(params).promise();
		return singleResultArr;
	} catch (error) {
		console.log(error);
	}
}

async function updateReimbursementAmount(empId, reimbursementId, totalAmount) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			Key: { PK: `EMP#${empId}`, SK: `RMBRSMNT#${reimbursementId}` },
			UpdateExpression: "set amount = :amt",
			ExpressionAttributeValues: {
				":amt": totalAmount,
			},
		};
		const singleResultArr = await dynamoDbClient.update(params).promise();
		return singleResultArr;
	} catch (error) {
		console.log(error);
	}
}

async function updateReimbursementSubmitted(
	empId,
	reimbursementId,
	transaction_number
) {
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		Key: { PK: `EMP#${empId}`, SK: `RMBRSMNT#${reimbursementId}` },
		UpdateExpression:
			"set RMB_status = :sts, transaction_number = :tn, GSI4_SK = :gsi4sk",
		ConditionExpression: "(RMB_status in (:sts2))",
		ExpressionAttributeValues: {
			":sts": "submitted",
			":sts2": "draft",
			":tn": transaction_number,
			":gsi4sk": `EMP#${empId}#submitted`,
		},
		ReturnValues: "ALL_OLD",
	};

	let singleResult;
	try {
		singleResult = await dynamoDbClient.update(params).promise();
	} catch (error) {
		console.log(error.code);
		console.log(error);
	}
	return singleResult;
}
