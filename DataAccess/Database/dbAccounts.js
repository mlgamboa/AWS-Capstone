const accountModel = require("../../Models/accountModel");
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const dbAccounts = { getAccountByEmployeeEmail };
module.exports = dbAccounts;

async function getAccountByEmployeeEmail(email) {
	//TODO: fix db query here

	const singleResultArr = ["assign db output here"];

	let account = null;
	if (singleResultArr.length === 1) {
		account = new accountModel();
		//TODO: assign db result to model here
		account.email = "sample@gmail.com";
		account.accountId = "assign db result here";
		account.employeeId = "assign db result here";
		account.hashedPassword = "assign db result here";
		account.isActive = "assign db result here";
		account.dateUpdated = "assign db result here";
	}
	return account;
}
