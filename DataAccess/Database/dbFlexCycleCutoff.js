const AWS = require("aws-sdk");
const flexCycleCutoffModel = require("../../Models/flexCycleCutoffModel");

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const dbFlexCycleCutoff = { getLatestFlexCycle, getFlexCycleById };
module.exports = dbFlexCycleCutoff;

async function getLatestFlexCycle() {
	try {
		const params = {
			TableName: process.env.REIMBURSEMENT_TABLE,
			KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
			ProjectionExpression: "CTF_id",
			ExpressionAttributeValues: {
				":pk": "true",
				":sk": "CTF#",
			},
			Limit: 1,
		};
		const singleResultArr = await dynamoDbClient.query(params).promise();
		let flexCycle = null;
		if (singleResultArr.Items.length === 1) {
			flexCycle = new flexCycleCutoffModel();
			flexCycle.flexCutoffId = singleResultArr.Items[0].CTF_id;
		}
		return flexCycle;
	} catch (error) {
		console.log(error);
	}
}

async function getFlexCycleById(id) {
	//TODO FIX ME
}
