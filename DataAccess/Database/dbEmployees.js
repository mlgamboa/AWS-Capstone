const AWS = require("aws-sdk");

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;

const dbEmployees = { getEmployeeDetailsById };
module.exports = dbEmployees;

async function getEmployeeDetailsById(userId) {
	//TODO: optimize query for getting employee details
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			KeyConditionExpression: "PK = :PK AND begins_with(SK, :SK)", // -- try '(PK = :PK)
			ProjectionExpression:
				"EMP_id, employee_number, first_name, last_name, email, is_active, date_added, EMP_role", // -- needed params (),
			ExpressionAttributeValues: {
				":PK": `EMP#${userId}`,
				":SK": `ROLE#`,
			},
		};
		const singleResultArr = await dynamoDbClient.query(params).promise();

		let employee;
		if (singleResultArr.Items.length === 1) {
			employee = {
				employeeId: singleResultArr.Items[0].EMP_id,
				employeeNumber: singleResultArr.Items[0].employee_number,
				firstName: singleResultArr.Items[0].first_name,
				lastName: singleResultArr.Items[0].last_name,
				email: singleResultArr.Items[0].email,
				isActive: singleResultArr.Items[0].is_active,
				dateAdded: singleResultArr.Items[0].date_added,
				role: singleResultArr.Items[0].EMP_role
			}
			
		}
		return employee;
	} catch (error) {
		console.log(error);
	}
}
