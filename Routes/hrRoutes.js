const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const { AUDIENCE_OPTIONS } = require("../Env/constants");
const { canUserAccess } = require("../Helpers/audienceHelper");
const responsesHelper = require("../Helpers/responsesHelper");
const dbReimbursement = require("../DataAccess/Database/dbReimbursement");

const hrRoutes = {
	getReimbbyCutoff,
	getReimbDetails,
	searchReimbByEmployee,
	approveReimbursement,
	rejectReimbursement,
};
module.exports = hrRoutes;
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;
async function getReimbbyCutoff(req, res, next) {
	try {
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.GET_REIMB_BY_CUTOFF
			)
		) {
			const cutoffId = req.body.cutoffId;

			const reimbursements =
				await dbReimbursement.getReimbursementByCutoffId(cutoffId); // US009

			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
				data: reimbursements,
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

			const reimbursement_detail =
				await dbReimbursement.getReimbursmentAndDetailsByReimbursementId(
					reimbursementId
				); // US0010

			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
				data: reimbursement_detail,
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

			const reimbursement_detail =
				await dbReimbursement.getReimbursmentAndDetailsByEmployeeId(
					cutoffId,
					employeeId,
					firstName,
					lastName
				); // US0010

			res.status(200).json({
				...responsesHelper.OkResponseBuilder("OK"),
				data: reimbursement_detail,
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
		const employeeId = req.query.employeeId;
		const data =
			await dbReimbursement.getSubmittedReimbursementsByEmployeeId(
				employeeId
			);
		console.log(data);
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.APPROVE_REIMB
			)
		) {
			const itemsToApprove = [];
			if (data.Items.length !== 0) {
				data.Items.forEach(element => {
					console.log(element.PK);
					itemsToApprove.push({
						TableName: REIMBURSEMENT_TABLE,
						Key: {
							PK: element.PK,
							SK: element.SK,
						},
						UpdateExpression: "set RMB_status = :newStatus",
						ExpressionAttributeValues: {
							":newStatus": "approved",
						},
					});
				});
				employeeFirstName = data.Items[0].first_name;
				employeeLastName = data.Items[0].last_name;

				await dbReimbursement.approveReimbursement(itemsToApprove);

				statement =
					employeeFirstName +
					" " +
					employeeLastName +
					"'s " +
					"Reimbursements has been approved";
				res.status(200).json({
					...responsesHelper.OkResponseBuilder("OK"),
					statement,
				});
			} else {
				statement = "No submitted reimbursement found";
				res.status(404).json(
					responsesHelper.notFoundBuilder(statement)
				);
			}
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
async function rejectReimbursement(req, res, next) {
	try {
		const employeeId = req.query.employeeId;
		const data =
			await dbReimbursement.getSubmittedReimbursementsByEmployeeId(
				employeeId
			);
		console.log(data);
		if (
			canUserAccess(
				req.headers["authorization"],
				AUDIENCE_OPTIONS.APPROVE_REIMB
			)
		) {
			const itemsToApprove = [];
			if (data.Items.length !== 0) {
				data.Items.forEach(element => {
					console.log(element.PK);
					itemsToApprove.push({
						TableName: REIMBURSEMENT_TABLE,
						Key: {
							PK: element.PK,
							SK: element.SK,
						},
						UpdateExpression: "set RMB_status = :newStatus",
						ExpressionAttributeValues: {
							":newStatus": "reject",
						},
					});
				});
				employeeFirstName = data.Items[0].first_name;
				employeeLastName = data.Items[0].last_name;

				await dbReimbursement.approveReimbursement(itemsToApprove);

				statement =
					employeeFirstName +
					" " +
					employeeLastName +
					"'s " +
					"Reimbursements has been approved";
				res.status(200).json({
					...responsesHelper.OkResponseBuilder("OK"),
					statement,
				});
			} else {
				statement = "No submitted reimbursement found";
				res.status(404).json(
					responsesHelper.notFoundBuilder(statement)
				);
			}
		} else {
			res.status(403).json(responsesHelper.forbiddenResponse);
		}
	} catch (error) {
		next(error);
	}
}
