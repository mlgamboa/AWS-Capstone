const { AUDIENCE_OPTIONS } = require("../Env/constants");
const { canUserAccess } = require("../Helpers/audienceHelper");
const responsesHelper = require("../Helpers/responsesHelper");
const hrHelper = require("../Helpers/hrHelper");

const hrRoutes = {
	getReimbbyCutoff,
	getReimbDetails,
	searchReimbByEmployee,
	approveReimbursement,
	rejectReimbursement,
};
module.exports = hrRoutes;

async function getReimbbyCutoff(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.GET_REIMB_BY_CUTOFF
			)
		) {
			//TODO get cutoffid from query
			//todo db call to get reimbursement array
			//format array

			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
			});
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
async function getReimbDetails(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.GET_REIMB_DETAILS
			)
		) {
			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
			});
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
async function searchReimbByEmployee(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.SEARCH_REIMB
			)
		) {
			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
			});
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
async function approveReimbursement(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.APPROVE_REIMB
			)
		) {
			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
			});
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
async function rejectReimbursement(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.REJECT_REIMB
			)
		) {
			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
			});
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
