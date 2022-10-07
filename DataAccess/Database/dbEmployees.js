const employeeModel = require("../../Models/employeeModel");

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;

const dbEmployees = { getEmployeeDetailsByEmail };
module.exports = dbEmployees;

async function getEmployeeDetailsByEmail(userId, reimbursementId) { // or async function getEmployeeDetailsById
	//TODO: optimize query for getting employee details
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			KeyConditionExpression:'PK = :PK AND SK = :SK',
			ExpressionAttributeValues: {
				':PK':`EMP#${userId}`,
				':SK':`RMBRSMNT#${reimbursementId}`
			}
		}
		const singleResultArr  = await dynamoDbClient.query(params).promise();
		
		let employee;
		if (singleResultArr.length === 1) {
		employee = new employeeModel();
		//TODO: assign db result to model here
		employee.employeeId = "assign db result here";
		employee.employeeNumber = "assign db result here";
		employee.firstName = "assign db result here";
		employee.lastName = "assign db result here";
		employee.email = "assign db result here";
		employee.isActive = "assign db result here";
		employee.dateAdded = "assign db result here";
		employee.companyId = "assign db result here";
		employee.role = "assign db result here";
		employee.roleId = "assign db result here";
	}
	return employee;
	}
	catch (error) {
		console.log(error)
	}
	
}
