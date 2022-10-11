const AWS = require("aws-sdk");

const dbReimbursement = {
	getLatestDraftByEmpId,
	add,
	updateReimbursementAmount,
	getReimbursementByCutoffId,
	getReimbursmentAndDetailsByReimbursementId,
	getReimbursmentAndDetailsByEmployee
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
	} catch (error) {}
}

async function updateReimbursementSubmitted(
	empId,
	reimbursementId,
	transactionNumber
) {
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		Key: { PK: `EMP#${empId}`, SK: `RMBRSMNT#${reimbursementId}` },
		UpdateExpression: "set amount = :amt",
		ExpressionAttributeValues: {
			":amt": totalAmount,
		},
	};
}

async function getReimbursementByCutoffId(cutoffId) {	// US009
	const params = {
		TableName: REIMBURSEMENT_TABLE,
      	IndexName: 'CTF_id-SK-index',
      	KeyConditionExpression: 'CTF_id = :ctf AND begins_with(SK, :sk)',
      	ExpressionAttributeValues: {
        	':ctf':`${cutoffId}`,
        	':sk':'RMBRSMNT#'
      	}
	};
	const data = await dynamoDbClient.query(params).promise();
	return data;
}

async function getReimbursmentAndDetailsByReimbursementId(reimbursementId) {	// US0010
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		IndexName: 'RMBRSMNT_id-SK-index',
		KeyConditionExpression: 'RMBRSMNT_id = :id AND begins_with(SK, :sk)',
		ExpressionAttributeValues: {
		  	':id':`${reimbursementId}`,
		  	':sk':`RMBRSMNT#${reimbursementId}`
		},
		ProjectionExpression: 'SK, RMB_status, amount, transaction_number, CTF_id, date_submitted, tin_of_establishment, name_of_establishment, or_number, category'
	};
	const data = await dynamoDbClient.query(params).promise();
	return data;
}

async function getReimbursmentAndDetailsByEmployee(cutoffId, employeeId, lastName, firstName) {	// US0011
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		IndexName: 'GSI6_PK-SK-index',
		KeyConditionExpression: 'GSI6_PK = :ctf AND begins_with(SK, :sk)',
		FilterExpression: 'PK = :pk OR begins_with(last_name, :ln) OR begins_with(first_name, :fn)',
		ExpressionAttributeValues: {
		  	':ctf':`${cutoffId}`,
		  	':sk':'RMBRSMNT#',
		  	':pk':`EMP#${employeeId}`,
		  	':ln':`${lastName}`,
		  	':fn':`${firstName}`
		},
		ProjectionExpression: 'SK, RMB_status, amount, transaction_number, CTF_id, date_submitted, tin_of_establishment, name_of_establishment, or_number, category, PK, first_name, last_name'
	  };
	const data = await dynamoDbClient.query(params).promise();
	return data;
}