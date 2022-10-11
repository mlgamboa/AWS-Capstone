const AWS = require("aws-sdk");
const dbReimbDetails = { getDetailsByReimbId, file, deleteDetail };
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
async function getDetailsByReimbId(reimbId) {}

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
			amount: parseInt(singleResult.Attributes.amount)
		}
	}
	return deletedDetail;
}
