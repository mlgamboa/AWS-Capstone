const AWS = require("aws-sdk");

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;

const dbFlexCycleCutoff = { getLatestFlexCycle, getFlexCycleById };
module.exports = dbFlexCycleCutoff;

async function getLatestFlexCycle() {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
			ProjectionExpression: "CTF_id",
			ExpressionAttributeValues: {
				":pk": "CTF#true",
				":sk": "CTF#",
			},
			Limit: 1,
		};
		const singleResultArr = await dynamoDbClient.query(params).promise();
		let flexCycle = null;
		if (singleResultArr.Items.length === 1) {
			flexCycle = {
				flexCutoffId: singleResultArr.Items[0].CTF_id
			}

		}
		return flexCycle;
	} catch (error) {
		console.log(error);
	}
}

async function getFlexCycleById(id) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			IndexName: "SK-CTF_id-index",
			KeyConditionExpression: "SK = :sk and CTF_id = :ctf",
			ProjectionExpression: "amount",
			ExpressionAttributeValues: {
				":sk": `CTF#${id}`,
				":ctf": id,
			},
		};
		const singleResultArr = await dynamoDbClient.query(params).promise();
		let flexCycle = null;
		if (singleResultArr.Items.length === 1) {
			flexCycle = {
				cutoffCapAmount: parseInt(singleResultArr.Items[0].amount)
      };
		}

		return flexCycle;
	} catch (error) {
		console.log(error);
	}
}
