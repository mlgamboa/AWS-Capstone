const errorHelper = {
	logErrorsToConsole,
	errorHandler,
	errorBuilder,
	clientErrorHandler,
};

module.exports = errorHelper;

function logErrorsToConsole(err, req, res, next) {
	let errorObj = errorBuilder(err);
	errorObj = {
		...errorObj,
		error: {
			...errorObj.error,
			stack: err.stack,
		},
	};

	console.error(`Log Entry: ${JSON.stringify(errorObj)}`);
	console.error("*".repeat(80));
	next(err);
}

function clientErrorHandler(err, req, res, next) {
	if (req.xhr) {
		res.status(500).json({
			status: 500,
			statusText: "Internal Server Error",
			message: "XMLHttpRequest error",
			error: {
				errno: 0,
				call: "XMLHttpRequest Call",
				code: "INTERNAL_SERVER_ERROR",
				message: "XMLHttpRequest error",
			},
		});
	} else {
		next(err);
	}
}

function errorHandler(err, req, res, next) {
	res.status(500).json(errorHelper.errorBuilder(err));
}

function errorBuilder(err) {
	return {
		status: 500,
		statusText: "Internal Server Error",
		message: err.message,
		error: {
			errno: err.errno,
			call: err.syscall,
			code: "INTERNAL_SERVER_ERROR",
			message: err.message,
			//stack: err.stack,
		},
	};
}
