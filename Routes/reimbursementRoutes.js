const { AUDIENCE_OPTIONS } = require("../Env/constants");
const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const reimbursementItemModel = require("../Models/reimbDetailModel");
const responsesHelper = require("../Helpers/responsesHelper");
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

			//TODO: fix db get employee by Id

			//TODO: fix get latest draft transaction
			const transaction = dbReimbursement.getLatestDraftByEmpId();

			if (!transaction) {
				//TODO a transaction
				//TODO get transaction
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
		}
	} catch (error) {
		next(error);
	}
}
