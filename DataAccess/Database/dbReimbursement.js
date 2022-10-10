const AWS = require("aws-sdk");
const reimbursementModel = require("../../Models/reimbursementModel");

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const dbReimbursement = {
	getLatestDraftByEmpId,
	add,
	updateReimbursementAmount,
};
module.exports = dbReimbursement;

async function getLatestDraftByEmpId(empId) {
	try {
		const params = {
			TableName: process.env.REIMBURSEMENT_TABLE,
			IndexName: "PK-GSI4_SK-index",
			KeyConditionExpression: "PK = :pk and GSI4_SK = :gsi4sk",
			ProjectionExpression: "amount, CTF_id, RMBRSMNT_id", // -- to filter out the output
			ExpressionAttributeValues: {
				":pk": `EMP#${empId}`,
				":gsi4sk": `EMP#${empId}#draft`, //EMP#36#approved
			},
		};
		const singleResultArr = await dynamoDbClient.query(params).promise();

		let reimbursement = null;
		if (singleResultArr.Items.length === 1) {
			reimbursement = new reimbursementModel();
			reimbursement.totalReimbursementAmount =
				singleResultArr.Items[0].amount;
			reimbursement.flexCutoffId = singleResultArr.Items[0].CTF_id;
			reimbursement.flexReimbursementId =
				singleResultArr.Items[0].RMBRSMNT_id;
		}
		return reimbursement;
	} catch (error) {
		console.log(error);
	}
}

async function add(empId, cutoffId) {}

async function updateReimbursementAmount(reimbursementId, totalAmount) {}
