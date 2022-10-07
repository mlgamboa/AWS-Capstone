const jwtHelper = require("./jwtHelper");

const audienceHelper = { canUserAccess };
module.exports = audienceHelper;

function canUserAccess(token, endpointString) {
	return jwtHelper.getAudienceFromToken(token).includes(endpointString);
}
