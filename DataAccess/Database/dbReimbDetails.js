const AWS = require("aws-sdk");
const dbReimbDetails = {
	getDetailsByReimbId,
	file,
	deleteDetail,
	updateDetailToSubmitted,
};
module.exports = dbReimbDetails;

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;

async function file(reimbDetail) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			Item: reimbDetail,
		};
		const singleResultArr = await dynamoDbClient.put(params).promise();
	} catch (error) {
		console.log(error);
	}
}
async function getDetailsByReimbId(empId, reimbursementId) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
			ProjectionExpression: "DTL_id",
			ExpressionAttributeValues: {
				":pk": `EMP#${empId}`,
				":sk": `RMBRSMNT#${reimbursementId}#DTL#`,
			},
		};
		const resultsArr = await dynamoDbClient.query(params).promise();

		let detailsArr = null;
		if (resultsArr.Items.length) {
			detailsArr = [];
			resultsArr.Items.forEach(item => {
				const detail = {
					detailId: item.DTL_id,
				};
				detailsArr.push(detail);
			});
		}
		return detailsArr;
	} catch (error) {
		console.log(error);
	}
}

async function updateDetailToSubmitted(empId, reimbursementId, detailId) {
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		Key: {
			PK: `EMP#${empId}`,
			SK: `RMBRSMNT#${reimbursementId}#DTL#${detailId}`,
		},
		ConditionExpression: "(RMB_status in (:sts2))",
		UpdateExpression: "set RMB_status = :sts",
		ExpressionAttributeValues: {
			":sts": "submitted",
			":sts2": "draft",
		},
	};
	let singleResult;
	try {
		singleResult = await dynamoDbClient.update(params).promise();
	} catch (error) {
		console.log(error);
	}
	return singleResult;
}

async function deleteDetail(empId, reimbursementId, detailId) {
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		Key: {
			PK: `EMP#${empId}`,
			SK: `RMBRSMNT#${reimbursementId}#DTL#${detailId}`,
		},
		ConditionExpression: "(RMB_status in (:sts))",
		ExpressionAttributeValues: {
			":sts": "draft",
		},
		ReturnValues: "ALL_OLD",
	};
	let singleResult;
	try {
		singleResult = await dynamoDbClient.delete(params).promise();
	} catch (error) {
		console.log(error.code);
	}
	let deletedDetail = null;
	if (singleResult) {
		deletedDetail = {
			amount: parseInt(singleResult.Attributes.amount),
		};
	}
	return deletedDetail;
}
