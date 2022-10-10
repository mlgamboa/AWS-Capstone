const AWS = require("aws-sdk");

const accountModel = require("../../Models/accountModel");
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;

const dbAccounts = { getAccountByEmployeeEmail };
module.exports = dbAccounts;

async function getAccountByEmployeeEmail(email, password) {
	//TODO: fix db query here
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		IndexName: 'GSI2',
		KeyConditionExpression: 'email = :email',
		// ProjectionExpression: 'PK, SK, first_name, last_name', -- to filter out the output 
		ExpressionAttributeValues: {
			':email':`${email}`
		}
	};
	const singleResultArr = await dynamoDbClient.query(params).promise();

	let account = null;
	if (singleResultArr.length === 1) {
		account = new accountModel();
		//TODO: assign db result to model here
		account.email = singleResultArr[0].email;
		account.password = singleResultArr[0].password;
		account.first_name = singleResultArr[0].first_name;
		account.last_name = singleResultArr[0].last_name;
		account.role = singleResultArr[0].SK;
		account.employee_id = singleResultArr[0].PK;
		// ---------------------------------------------------------------
		// account.email = "sample@gmail.com";
		// account.accountId = "assign db result here";
		// account.employeeId = "assign db result here";
		// account.hashedPassword = "assign db result here";
		// account.isActive = "assign db result here";
		// account.dateUpdated = "assign db result here";
	}
	return account;
}
