const jwtHelper = { getEmployeeEmailFromToken, generateToken };
module.exports = jwtHelper;

function getEmployeeEmailFromToken(token) {
	return jwt.decode(token)["sub"];
}

async function generateToken(prevToken, userEmail) {
	const email = userEmail || getEmployeeEmailFromToken(prevToken);
	const employee = await DbEmployees.getEmployeeDetailsByEmail(email);

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
