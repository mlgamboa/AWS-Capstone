const userRoutes = { login };
module.exports = userRoutes;

async function login(req, res, next) {
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
	} catch (error) {
		next(error);
	}

	if (!account) {
	}
}
