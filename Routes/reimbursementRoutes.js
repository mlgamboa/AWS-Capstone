const { AUDIENCE_OPTIONS } = require("../Env/constants");
const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const dbReimbDetails = require("../DataAccess/Database/dbReimbDetails");
const responsesHelper = require("../Helpers/responsesHelper");
const reimbursementHelper = require("../Helpers/reimbursementHelper");
const { canUserAccess } = require("../Helpers/audienceHelper");
const dataValidationHelper = require("../Helpers/dataValidationHelper");
const jwtHelper = require("../Helpers/jwtHelper");

const reimbursementRoutes = { file, deleteReimbDetail, printReimbursement };
module.exports = reimbursementRoutes;

async function file(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.FILE_REIMBURSEMENT_DETAIL
			)
		) {
			const reimbDetail = {
				date: req.body.date,
				orNumber: req.body.orNumber,
				nameEstablishment: req.body.nameEstablishment,
				tinEstablishment: req.body.tinEstablishment,
				amount: req.body.amount,
				categoryCode: req.body.category,
			};

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
				formattedReimbDetail =
					await reimbursementHelper.formatReimbDetail(
						empId,
						reimbDetail,
						reimbursement
					);

				const newTotal =
					reimbursement.totalReimbursementAmount + reimbDetail.amount;

				await dbReimbDetails.file(formattedReimbDetail);
				await dbReimbursement.updateReimbursementAmount(
					empId,
					reimbursement.flexReimbursementId,
					newTotal
				);

				res.status(200).json({
					...responsesHelper.OkResponseBuilder("Detail Filed"),
				});
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
			const empId = jwtHelper.getEmployeeIdFromToken(
				req.headers["authorization"]
			);
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
				const deletedDetail = await dbReimbDetails.deleteDetail(
					empId,
					reimbursement.flexReimbursementId,
					req.body.itemId
				);

				if (!deletedDetail) {
					res.status(404).json({
						...responsesHelper.notFoundBuilder("Item not found"),
					});
				} else {
					const newTotal =
						reimbursement.totalReimbursementAmount -
						deletedDetail.amount;
					await dbReimbursement.updateReimbursementAmount(
						empId,
						reimbursement.flexReimbursementId,
						newTotal
					);
					res.status(200).json(
						responsesHelper.OkResponseBuilder("OK. Detail deleted")
					);
				}
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
			const empId = jwtHelper.getEmployeeIdFromToken(
				req.headers["authorization"]
			);
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
				//TODO: generate transaction number
				// const transactionNumber
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
			const empId = jwtHelper.getEmployeeIdFromToken(req.headers["authorization"]);
			const reimbursementNumber = req.body.reimbursement_id

			const data = await dbReimbursement.getReimbursentAndDetails(empId, reimbursementNumber);

			if (data.length !== 0) {
				res.status(200).json({ message: "Transaction printed" });
			} else {
				res.status(403).json({ message: "Transaction not found." });
			}

		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
