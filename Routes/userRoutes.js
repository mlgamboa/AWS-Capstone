const userRoutes = { login };
module.exports = userRoutes;

async function login(req, res, next) {
	const credentials = req.headers.authorization.split(":");
	Email = credentials[0];
	UnhashedPassword = credentials[1];

	if (!Email || !UnhashedPassword) {
		res.status(401).json({
			status: 401,
			statusText: "Unauthorized",
			message: "Invalid username or password",
		});
		return;
	}
}
