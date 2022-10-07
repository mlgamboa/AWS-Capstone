const employeeModel = require("../../Models/employeeModel");

const dbEmployees = { getEmployeeDetailsByEmail };
module.exports = dbEmployees;

async function getEmployeeDetailsByEmail(email) {
	//TODO: fix db query here

	const singleResultArr = ["assign db output here"];

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
