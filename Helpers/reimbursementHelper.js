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
	};
	return detail;
}

async function formatDraftReimbursement(empId, cutoffId) {
	const employee = await dbEmployees.getEmployeeDetailsById(empId);
	const uuid = uuidv4();
	const reimbursement = {
		PK: `EMP#${empId}`, //EMP#35
		SK: `RMBRSMNT#${uuid}`, // RMBRSMNT#uuid
		amount: "0",
		CTF_id: cutoffId, //cutoff id
		date_submitted: "", //none yet
		GSI4_SK: `EMP#${empId}#draft`, //EMP#35#draft
		GSI5_PK: employee.lastName, //lastname
		GSI6_PK: employee.firstName, //firstname
		RMB_status: "draft",
		RMBRSMNT_id: uuid, //uuid
		transaction_number: "", //none yet
	};

	return reimbursement;
}

// async function calculateReimbursementAmount(reimbursementId) {
// 	const reimbDetailsArr = await dbReimbDetails.getDetailsByReimbId(
// 		reimbursementId
// 	);

// 	let totalAmount = 0;

// 	reimbDetailsArr.forEach(element => {
// 		totalAmount += element.amount;
// 	});

// 	await dbReimbursement.updateReimbursementAmount(
// 		reimbursementId,
// 		totalAmount
// 	);

// 	return totalAmount;
// }

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
