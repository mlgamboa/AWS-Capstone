const bcrypt = require("bcrypt");
const responsesHelper = require("../Helpers/responsesHelper");
const jwtHelper = require("../Helpers/jwtHelper");
const dbAccounts = require("../DataAccess/Database/dbAccounts");

const userRoutes = { login, logout };
module.exports = userRoutes;

//TODO: Fix database call
//TODO: Fix generate token
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

	try {
		const account = await dbAccounts.getAccountByEmployeeEmail(email);

		if (!account) {
			res.status(401).json({
				...responsesHelper.unathorizedResponseBuilder(
					invalidCredsMessage
				),
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
				let token = await jwtHelper.generateToken(null, account.Email);
				res.cookie("token", token, { httpOnly: true });
				res.status(200).json({
					...responsesHelper.OkResponseBuilder("OK"),
				});
			}
		}
	} catch (error) {
		next(error);
	}
}

async function logout(req, res, next) {
	res.clearCookie("token");
	res.status(200).json({
		...responsesHelper.OkResponseBuilder("Cookies cleared"),
	});
}
