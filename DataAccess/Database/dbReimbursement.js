const AWS = require("aws-sdk");
const reimbursementModel = require("../../Models/reimbursementModel");

const dbReimbursement = {
	getLatestDraftByEmpId,
	add,
	updateReimbursementAmount,
	getSubmittedReimbursementsByEmployeeId,
	approveReimbursement,
	rejectReimbursement
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
			reimbursement = new reimbursementModel();
			reimbursement.totalReimbursementAmount = parseInt(
				singleResultArr.Items[0].amount
			);
			reimbursement.flexCutoffId = singleResultArr.Items[0].CTF_id;
			reimbursement.flexReimbursementId =
				singleResultArr.Items[0].RMBRSMNT_id;
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

async function getSubmittedReimbursementsByEmployeeId(employeeId) {
	try{
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		KeyConditionExpression: 'PK = :PK and begins_with(SK, :sk)',
		FilterExpression: 'RMB_status = :status',
		ExpressionAttributeValues: {
			':PK': `EMP#${employeeId}`,
			':sk': 'RMBRSMNT#',
			':status': 'submitted'
		}
	};
		const data = await dynamoDbClient.query(params).promise();
		return data;
	
	} catch (error) {}
}

async function approveReimbursement(params){
    try {
        const approveItems = params.map(async (item) => {
            await dynamoDbClient.update(item).promise();
        });

        await Promise.all(approveItems);
        
    } catch (error) {
        console.log(error);
    }
}

async function rejectReimbursement(params){
    try {
        const rejectItems = params.map(async (item) => {
            await dynamoDbClient.update(item).promise();
        });

        await Promise.all(rejectItems);
      
    } catch (error) {
        console.log(error);
    }
}