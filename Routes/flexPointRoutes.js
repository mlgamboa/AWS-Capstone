const { AUDIENCE_OPTIONS } = require("../Env/constants");
const { canUserAccess } = require("../Helpers/audienceHelper");
const responsesHelper = require("../Helpers/responsesHelper");

const flexPointRoutes = { calculateFlexPoints };
module.exports = flexPointRoutes;

async function calculateFlexPoints(req, res, next) {
	if (
		canUserAccess(
			req.headers["authorization"],
			AUDIENCE_OPTIONS.CALCULATE_FLEX_POINTS
		)
	) {
		try {
			const flexCredits = req.body.flexCredits ? req.body.flexCredits : 0;
			const monthlyRate = req.body.monthlyRate ? req.body.monthlyRate : 0;

			const flexPoints = (monthlyRate / 21.75) * flexCredits;

			res.status(200).json({
				...responses.OkResponseBuilder("Flex points calculated"),
				data: parseInt(flexPoints.toFixed(0)),
			});
		} catch (error) {
			next(error);
		}
	} else {
		res.status(403).json(responsesHelper.forbiddenResponse);
	}
}
