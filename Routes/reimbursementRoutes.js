const { AUDIENCE_OPTIONS } = require("../Env/constants");
const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const dbReimbDetails = require("../DataAccess/Database/dbReimbDetails");
const reimbDetailModel = require("../Models/reimbDetailModel");
const responsesHelper = require("../Helpers/responsesHelper");
const reimbursementHelper = require("../Helpers/reimbursementHelper");
const { canUserAccess } = require("../Helpers/audienceHelper");
const dataValidationHelper = require("../Helpers/dataValidationHelper");
const jwtHelper = require("../Helpers/jwtHelper");

const reimbursementRoutes = { file };
module.exports = reimbursementRoutes;

async function file(req, res, next) {
	try {
		if (
			// canUserAccess(
			// 	req.headers["authorization"],
			// 	AUDIENCE_OPTIONS.FILE_REIMBURSEMENT_DETAIL
			// )
			true
		) {
			const reimbDetail = new reimbDetailModel();
			reimbDetail.date = req.body.date;
			reimbDetail.orNumber = req.body.orNumber;
			reimbDetail.nameEstablishment = req.body.nameEstablishment;
			reimbDetail.tinEstablishment = req.body.tinEstablishment;
			reimbDetail.amount = req.body.amount;
			reimbDetail.categoryCode = req.body.category;

			const empId = jwtHelper.getEmployeeIdFromToken(
				req.headers["authorization"]
			);

			let reimbursement = await dbReimbursement.getLatestDraftByEmpId(
				empId
			);

			if (!reimbursement) {
				await reimbursementHelper.makeDraftReimbursement(empId);
				reimbursement = await dbReimbursement.getLatestDraftByEmpId(
					empId
				);
			}

			console.log(reimbursement);
			res.status(200).json({ message: "OK" });
			return;
			const validationResults =
				await dataValidationHelper.validateReimbursementDetail(
					reimbDetail,
					reimbursement
				);

			if (validationResults.errors.length) {
				res.status(400).json({
					...responsesHelper.badRequestResponseBuilder(
						validationResults.message
					),
					data: validationResults.errors,
				});
			} else {
				reimbDetails = {
					...reimbursementHelper.formatReimbDetail(
						empId,
						reimbDetail,
						reimbursement
					),
				};
				await dbReimbDetails.file(reimbDetail);
				await dbReimbursement.updateReimbursementAmount(empId);
			}
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
				AUDIENCE_OPTIONS.DELETE_REIMBURSEMENT_DETAIL
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
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
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
				AUDIENCE_OPTIONS.SUBMIT_REIMBURSEMENT
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
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}

async function printReimbursement(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.PRINT_REIMBURSEMENT
			)
		) {
			const empId = jwtHelper.getEmployeeIdFromToken(token);
			//TODO get reimbursementNumber = req.body.transactionNumber
			const reimbursement = await dbReimbursement.getLatestDraftByEmpId(
				empId
			);

			//TODO get reimbursement by reimbursement number
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
