const AWS = require("aws-sdk");
const FileReimbursementTransaction = require("../Files/fileReimbursementTransaction");

const dbReimbursement = {
	getLatestDraftByEmpId,
	add,
	updateReimbursementAmount, getReimbursentAndDetails
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
				flexReimbursementId:
					singleResultArr.Items[0].RMBRSMNT_id
			}
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

async function getReimbursentAndDetails(empId, reimbursementId) {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			KeyConditionExpression: "PK = :pk and  begins_with(SK, :sk)",
			ExpressionAttributeValues: {
			  ":pk": `EMP#${empId}`,
			  ":sk": `RMBRSMNT#${reimbursementId}`,
			},
		  };

		  const queryResult = await dynamoDbClient.query(params).promise();

		  let data = queryResult.Items;

		  console.log(data);

		  let transaction = null;
		  let detailsArr = [];
		  let categories = [];

		  data.forEach((item) => {
			if (item.SK === `RMBRSMNT#${reimbursementId}`) {
			  transaction = item;
			} else {
			  detailsArr.push(item);
			  if (categories.indexOf(item.category) === -1) {
				categories.push(item.category);
			  }
			}
		  });

		  if (transaction) {
			await FileReimbursementTransaction.print(
				transaction,
				detailsArr,
				categories
			  );
		  }

		  return data;
}
