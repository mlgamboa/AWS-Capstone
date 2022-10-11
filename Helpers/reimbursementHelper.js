const dbFlexCycleCutoff = require("../DataAccess/Database/dbFlexCycleCutoff");
const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const dbEmployees = require("../DataAccess/Database/dbEmployees");
const { v4: uuidv4 } = require("uuid");
const reimbursementModel = require("../Models/reimbursementModel");

const reimbursementHelper = {
	makeDraftReimbursement,
	formatReimbDetail,
};
module.exports = reimbursementHelper;

async function makeDraftReimbursement(empId) {
	const latestFlexCycleCutoff = await dbFlexCycleCutoff.getLatestFlexCycle();
	const reimbursement = await formatDraftReimbursement(
		empId,
		latestFlexCycleCutoff.flexCutoffId
	);
	await dbReimbursement.add(reimbursement);
}

async function formatReimbDetail(empId, reimbDetail, reimbursement) {
	const employee = await dbEmployees.getEmployeeDetailsById(empId);
	const uuid = uuidv4();
	const detail = {
		PK: `EMP#${empId}`,
		SK: `RMBRSMNT#${reimbursement.flexReimbursementId}#DTL#${uuid}`,
		amount: reimbDetail.amount,
		category: reimbDetail.categoryCode,
		GSI5_PK: employee.lastName,
		GSI6_PK: employee.firstName,
		name_of_establishment: reimbDetail.nameEstablishment,
		or_number: reimbDetail.orNumber,
		RMB_status: "draft",
		tin_of_establishment: reimbDetail.tinEstablishment,
		RMBRSMNT_id: reimbursement.flexReimbursementId,
	};
	return detail;
}

async function formatDraftReimbursement(empId, cutoffId) {
	const employee = await dbEmployees.getEmployeeDetailsById(empId);
	const uuid = uuidv4();
	const reimbursement = {
		PK: `EMP#${empId}`,
		SK: `RMBRSMNT#${uuid}`,
		amount: "0",
		CTF_id: cutoffId,
		date_submitted: "",
		GSI4_SK: `EMP#${empId}#draft`,
		GSI5_PK: employee.lastName,
		GSI6_PK: employee.firstName,
		RMB_status: "draft",
		RMBRSMNT_id: uuid,
		transaction_number: "",
	};

	return reimbursement;
}

async function generateTransactionNumber(reimbursement) {
	// TODO const company = get company
	const dateNow = new Date();
	const formattedDate = formatDate(dateNow);
	// return transactionNumber = `${company.Code}-${reimbursement.FlexCutoffId}-${formattedDate}-${reimbursement.FlexReimbursementId}`;
}

function formatDate(dateToFormat) {
	let date = new Date(dateToFormat);
	return `${date.getFullYear()}${(date.getMonth() + 1)
		.toString()
		.padStart(2, "0")}${date.getDate()}`;
}
