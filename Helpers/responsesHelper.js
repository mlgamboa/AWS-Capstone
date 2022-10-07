function OkResponseBuilder(message) {
	return {
		status: 200,
		statusText: "OK",
		message: message,
	};
}
function createdBuilder(message) {
	return {
		status: 201,
		statusText: "Created",
		message: message,
	};
}
function noContentResponse(message) {
	return {
		status: 204,
		statusText: "No Content",
		message: message,
	};
}
function badRequestResponseBuilder(message) {
	return {
		status: 400,
		statusTest: "Bad Request",
		message: message,
	};
}
function unathorizedResponseBuilder(message) {
	return {
		status: 401,
		statusText: "Unauthorized",
		message: message,
	};
}

let forbiddenResponse = {
	status: 403,
	statusText: "Forbidden",
	message: "Insufficient authorization to access data",
};
function notFoundBuilder(message) {
	return {
		status: 404,
		statusText: "Not Found",
		message: message,
		error: {
			code: "NOT_FOUND",
			message: message,
		},
	};
}

function conflictResponseBuilder(message) {
	return {
		status: 409,
		statusText: "Conflict",
		message: message,
	};
}

let Responses = {
	OkResponseBuilder,
	createdBuilder,
	noContentResponse,
	badRequestResponseBuilder,
	unathorizedResponseBuilder,
	forbiddenResponse,
	notFoundBuilder,
	conflictResponseBuilder,
};

module.exports = Responses;
