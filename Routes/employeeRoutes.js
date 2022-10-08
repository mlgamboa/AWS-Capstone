const responsesHelper = require("../Helpers/responsesHelper");
const { canUserAccess } = require("../Helpers/audienceHelper");
const responsesHelper = require("../Helpers/responsesHelper");
const jwtHelper = require("../Helpers/jwtHelper");
const { AUDIENCE_OPTIONS } = require("../Env/constants");
const dbEmployees = require("../DataAccess/Database/dbEmployees");

const employeeRoutes = { getDetails };
module.exports = employeeRoutes;

async function getDetails(req, res, next) {
	//TODO: fix db calls
	//TODO: fix roles
	try {
		if (
			canUserAccess(req.cookies.token, AUDIENCE_OPTIONS.EMPLOYEE_DETAILS)
		) {
			const userId = req.params.userId;
			const reimbursementId = req.params.reimbursementId;
			const email = jwtHelper.getEmployeeEmailFromToken(
				req.cookies.token
			);
			const employee = await dbEmployees.getEmployeeDetailsByEmail(email);
			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
				data: {
					firstName: employee.firstName,
					lastName: employee.lastName,
					role: employee.role,
				},
			});
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
