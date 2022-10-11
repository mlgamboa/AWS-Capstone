const jwt = require("jsonwebtoken");

const { JWT_OPTIONS } = require("../Env/constants");
const responsesHelper = require("../Helpers/responsesHelper");
const dbEmployees = require("../DataAccess/Database/dbEmployees");
const dbUser = require("../DataAccess/Database/dbUser");

const jwtHelper = {
	getEmployeeIdFromToken,
	generateToken,
	verifyToken,
	getAudienceFromToken
};
module.exports = jwtHelper;

function getEmployeeIdFromToken(token) {
	return jwt.decode(token)["sub"];
}

function getAudienceFromToken(token) {
	return jwt.decode(token)["aud"];
}

//TODO: fix db call
async function generateToken(prevToken, userId) {
	const id = userId || getEmployeeIdFromToken(prevToken);
	const employee = await dbEmployees.getEmployeeDetailsById(id);
	console.log(employee);

	let audience;
	switch (employee.role) {
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
		algorithm: process.env.ALGORITHM,
		expiresIn: process.env.EXPIRY,
		issuer: process.env.ISSUER,
		subject: userId || employee.employeeId,
		audience: audience,
	};
	return jwt.sign({}, process.env.SECRET_KEY, options);
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
		jwt.verify(authHeader, process.env.SECRET_KEY, function (err, decoded) {
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

