const bcrypt = require("bcrypt");

const responsesHelper = require("../Helpers/responsesHelper");
const jwtHelper = require("../Helpers/jwtHelper");
const dbUser = require("../DataAccess/Database/dbUser");

// const dbAccounts = require("../DataAccess/Database/dbAccounts");

const userRoutes = { login, logout };
module.exports = userRoutes;

async function login(req, res, next) {

	const invalidCredsMessage = "Invalid username or password";
	// const credentialsArr = req.headers.authorization.split(":");

	// email = credentialsArr[0];
	// unhashedPassword = credentialsArr[1];
	const email = req.body.email;
	const unhashedPassword = req.body.password;
	console.log(email);
	console.log(unhashedPassword);
	if (!email || !unhashedPassword) {
		res.status(401).json({
			status: 401,
			statusText: "Unauthorized",
			message: "Invalid username or password",
		});
		return;
	}

	try {
		const account = await dbUser.getUserByCredentials(email, unhashedPassword);
		console.log(account);

		if (!account) {
			res.status(401).json({
				...responsesHelper.unathorizedResponseBuilder(
				"Account not found"
				),
			});
		} else {
			const isMatch = unhashedPassword == account.password;
			if (!isMatch) {
				res.status(401).json({
					...responsesHelper.unathorizedResponseBuilder(
						"Password does not match"
					),
				});
			} else {
				let token = await jwtHelper.generateToken(null, account.employeeId);
				// res.cookie("token", token, { httpOnly: true });
				res.status(200).json({
					...responsesHelper.OkResponseBuilder("OK"),
					accessToken: token
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
