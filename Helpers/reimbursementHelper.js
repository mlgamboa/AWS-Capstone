const dbFlexCycleCutoff = require("../DataAccess/Database/dbFlexCycleCutoff");
const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const dbCompany = require("../DataAccess/Database/dbCompany");
const dbEmployees = require("../DataAccess/Database/dbEmployees");
const dbReimbDetails = require("../DataAccess/Database/dbReimbDetails");
const { v4: uuidv4 } = require("uuid");

const reimbursementHelper = {
	makeDraftReimbursement,
	formatReimbDetail,
	generateTransactionNumber,
	updateDetailsSubmitted,
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
		last_name: employee.lastName,
		first_name: employee.firstName,
		name_of_establishment: reimbDetail.nameEstablishment,
		or_number: reimbDetail.orNumber,
		RMB_status: "draft",
		tin_of_establishment: reimbDetail.tinEstablishment,
		RMBRSMNT_id: reimbursement.flexReimbursementId,
		date_submitted: formatDate(),
		DTL_id: uuid,
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
		last_name: employee.lastName,
		first_name: employee.firstName,
		RMB_status: "draft",
		RMBRSMNT_id: uuid,
		transaction_number: "",
		date_submitted: formatDate(),
	};

	return reimbursement;
}

function formatDate() {
	const dateNow = new Date();
	const year = dateNow.getFullYear();
	const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
	const date = dateNow.getDate();
	return `${year}-${month}-${date}`;
}

async function generateTransactionNumber(empId, reimbursement) {
	const company = await dbCompany.getCompanyByEmpId(empId);
	const dateNow = new Date();
	const formattedDate = formatDateTransactionNumber(dateNow);
	return (transactionNumber = `${company.code}-${reimbursement.flexCutoffId}-${formattedDate}-${reimbursement.flexReimbursementId}`);
}

function formatDateTransactionNumber(dateToFormat) {
	const date = new Date(dateToFormat);
	return `${date.getFullYear()}${(date.getMonth() + 1)
		.toString()
		.padStart(2, "0")}${date.getDate()}`;
}

async function updateDetailsSubmitted(empId, reimbursement) {
	const detailArr = await dbReimbDetails.getDetailsByReimbId(
		empId,
		reimbursement.flexReimbursementId
	);

	detailArr.forEach(async detail => {
		await dbReimbDetails.updateDetailToSubmitted(
			empId,
			reimbursement.flexReimbursementId,
			detail.detailId
		);
	});
	return detailArr;
}
