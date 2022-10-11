const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
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

			const cutoffId = req.body.cutoffId;

			const reimbursements = await dbReimbursement.getReimbursementByCutoffId(cutoffId);	// US009

			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
				data: reimbursements
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
			const reimbursementId = req.body.reimbursementId;

			const reimbursement_detail = await dbReimbursement.getReimbursmentAndDetailsByReimbursementId(reimbursementId);	// US0010

			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
				data: reimbursement_detail
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
			const cutoffId = req.body.cutoffId;
			const employeeId = req.body.employeeId;
			const firstName = req.body.firstName;
			const lastName = req.body.lastName;

			const reimbursement_detail = await dbReimbursement.getReimbursmentAndDetailsByEmployeeId(cutoffId, employeeId, firstName, lastName);	// US0010

			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
				data: reimbursement_detail
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
