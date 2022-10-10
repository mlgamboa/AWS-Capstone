const AWS = require("aws-sdk");
const dbReimbDetails = { getDetailsByReimbId, file };
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
	} catch (error) {}
}
async function getDetailsByReimbId(reimbId) {}
