const jwt = require("jsonwebtoken");

const { JWT_OPTIONS } = require("../Env/constants");
const responsesHelper = require("../Helpers/responsesHelper");
const dbEmployees = require("../DataAccess/Database/dbEmployees");

const jwtHelper = {
	getEmployeeIdFromToken,
	generateToken,
	verifyToken,
	getAudienceFromToken,
};
module.exports = jwtHelper;

function getEmployeeIdFromToken(token) {
	return jwt.decode(token)["sub"];
}

function getAudienceFromToken(token) {
	return jwt.decode(token)["aud"];
}

//TODO: fix db call
async function generateToken(prevToken, userEmail) {
	const email = userEmail || getEmployeeIdFromToken(prevToken);
	const employee = await dbEmployees.getEmployeeDetailsByEmail(email);

	let audience;
	switch (employee.Role) {
		case "employee":
			audience = JWT_OPTIONS.EMPLOYEE_AUDIENCE;
			break;
		case "hr":
			audience = JWT_OPTIONS.HR_AUDIENCE;
			break;
		case "payroll":
			audience = JWT_OPTIONS.PAYROLL_AUDIENCE;
			break;

		default:
			audience = [];
			break;
	}
	const options = {
		algorithm: ALGORITHM,
		expiresIn: EXPIRY,
		issuer: ISSUER,
		//TODO: change email to id
		subject: userEmail || employee.Email,
		audience: audience,
	};
	return jwt.sign({}, SECRET_KEY, options);
}

function verifyToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	if (!authHeader) {
		res.status(401).json({
			...responsesHelper.unathorizedResponseBuilder(
				"Not authorized to access data"
			),
		});
	} else {
		jwt.verify(authHeader, SECRET_KEY, function (err) {
			if (err) {
				console.error(err);
				res.status(401).json({
					...responsesHelper.unathorizedResponseBuilder(
						"Please login again"
					),
				});
			} else next();
		});
	}
}
