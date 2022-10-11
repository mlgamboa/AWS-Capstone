// const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const responsesHelper = require("../Helpers/responsesHelper");
const jwtHelper = require("../Helpers/jwtHelper");
const dbUser = require("../DataAccess/Database/dbUser");

const userRoutes = { login, logout };
module.exports = userRoutes;

async function login(req, res, next) {

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
					accessToken: token,
					account
				});
			}
		}
	} catch (error) {
		next(error);
	}
}

async function logout(req, res, next) {
	const authHeader = req.headers['authorization'];
	const logoutToken = jwt.sign({authHeader}, process.env.CLEAR_SECRET_KEY, {expiresIn: '1'});
	res.status(200).json({
		...responsesHelper.OkResponseBuilder("Logged out"),
		logoutToken
	});
	
}
