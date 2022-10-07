const jwt = require("jsonwebtoken");

const { JWT_OPTIONS } = require("../Env/constants");
const responsesHelper = require("../Helpers/responsesHelper");
const dbEmployees = require("../DataAccess/Database/dbEmployees");

const jwtHelper = { getEmployeeEmailFromToken, generateToken, verifyToken };
module.exports = jwtHelper;

function getEmployeeEmailFromToken(token) {
	return jwt.decode(token)["sub"];
}

function getAudienceFromToken(token) {
	return jwt.decode(token)["aud"];
}

//TODO: fix db call
async function generateToken(prevToken, userEmail) {
	const email = userEmail || getEmployeeEmailFromToken(prevToken);
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
		algorithm: process.env.ALGORITHM,
		expiresIn: process.env.EXPIRY,
		issuer: process.env.ISSUER,
		subject: userEmail || employee.Email,
		audience: audience,
	};
	return jwt.sign({}, process.env.SECRET, options);
}

//TODO: fix env call to jwt secret
function verifyToken(req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		res.status(401).json({
			...responsesHelper.unathorizedResponseBuilder(
				"Not authorized to access data"
			),
		});
	} else {
		jwt.verify(token, process.env.SECRET, function (err) {
			if (err) {
				console.error(err);
				res.clearCookie("token");
				res.status(401).json({
					...responsesHelper.unathorizedResponseBuilder(
						"Please login again"
					),
				});
			} else next();
		});
	}
}
