const bcrypt = require("bcrypt");
const responsesHelper = require("../Helpers/responsesHelper");

const userRoutes = { login, logout };
module.exports = userRoutes;

async function login(req, res, next) {
	const invalidCredsMessage = "Invalid username or password";
	const credentialsArr = req.headers.authorization.split(":");

	email = credentialsArr[0];
	unhashedPassword = credentialsArr[1];

	if (!email || !unhashedPassword) {
		res.status(401).json({
			status: 401,
			statusText: "Unauthorized",
			message: "Invalid username or password",
		});
		return;
	}

	let account;
	try {
		// account = db get account by email
		// account = {
		// 	hashedPassword: "for testing",
		// };
	} catch (error) {
		next(error);
	}

	if (!account) {
		res.status(401).json({
			...responsesHelper.unathorizedResponseBuilder(invalidCredsMessage),
		});
	} else {
		const isMatch = await bcrypt.compare(
			unhashedPassword,
			account.hashedPassword
		);
		if (!isMatch) {
			res.status(401).json({
				...responsesHelper.unathorizedResponseBuilder(
					invalidCredsMessage
				),
			});
		} else {
			// let token = await jwtHelper.generateToken(null, account.Email);
			// res.cookie("token", token, { httpOnly: true });
			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
			});
		}
	}
}

async function logout(req, res, next) {
	res.clearCookie("token");
	res.status(200).json({
		...responsesHelper.OkResponseBuilder("Cookies cleared"),
	});
}
