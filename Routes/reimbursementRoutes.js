const { AUDIENCE_OPTIONS } = require("../Env/constants");
const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const reimbursementItemModel = require("../Models/reimbDetailModel");
const responsesHelper = require("../Helpers/responsesHelper");
const reimbursementHelper = require("../Helpers/reimbursementHelper");
const { canUserAccess } = require("../Helpers/audienceHelper");

const reimbursementRoutes = {};
module.exports = reimbursementRoutes;

async function file(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.FILE_REIMBURSEMENT_ITEM
			)
		) {
			const reimbursementItem = new reimbursementItemModel();
			reimbursementItem.Date = req.body.date;
			reimbursementItem.OrNumber = req.body.orNumber;
			reimbursementItem.NameEstablishment = req.body.nameEstablishment;
			reimbursementItem.TinEstablishment = req.body.tinEstablishment;
			reimbursementItem.Amount = req.body.amount;
			reimbursementItem.CategoryCode = req.body.category;

			const empId = jwtHelper.getEmployeeIdFromToken(token);
			const reimbursement = dbReimbursement.getLatestDraftByEmpId(empId);

			if (!reimbursement) {
				await reimbursementHelper.makeDraftReimbursement(empId);
				reimbursement = dbReimbursement.getLatestDraftByEmpId(empId);
			}

			//TODO validate reimbursement detail
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}

async function deleteReimbDetail(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.DELETE_REIMBURSEMENT_ITEM
			)
		) {
			const empId = jwtHelper.getEmployeeIdFromToken(token);
			const reimbursement = await dbReimbursement.getLatestDraftByEmpId(
				empId
			);

			if (!reimbursement) {
				res.status(400).json({
					...responsesHelper.badRequestResponseBuilder(
						"No draft transaction"
					),
				});
			} else {
				// delete transaction db delete transaction
				// recalculate transaction amount
			}
		}
	} catch (error) {
		next(error);
	}
}

async function submitReimbursement(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.SUBMIT_REIMBURSEMENT_TRANSACTION
			)
		) {
			const empId = jwtHelper.getEmployeeIdFromToken(token);
			const reimbursement = await dbReimbursement.getLatestDraftByEmpId(
				empId
			);

			if (!reimbursement) {
				res.status(400).json({
					...responsesHelper.badRequestResponseBuilder(
						"No draft transaction"
					),
				});
			} else {
				// delete transaction db delete transaction
				// recalculate transaction amount
			}
		}
	} catch (error) {
		next(error);
	}
}
