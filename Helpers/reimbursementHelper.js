const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const { v4: uuidv4 } = require("uuid");
const dbEmployees = require("../DataAccess/Database/dbEmployees");

const reimbursementHelper = {
	makeDraftReimbursement,
	formatReimbDetail,
};
module.exports = reimbursementHelper;

async function makeDraftReimbursement(empId) {
	const latestFlexCycleCutoff = await dbFlexCycleCutoff.getLatestFlexCycle();
	await dbReimbursement.add(empId, latestFlexCycleCutoff.cutoffId);
}

function formatReimbDetail(empId, reimbDetail, reimbursement) {
	const employee = dbEmployees.getEmployeeDetailsById(empId);

	return {
		...reimbDetail,
		PK: `EMP#${empId}`,
		SK: `RMBRSMNT#${reimbursement.flexReimbursementId}`,
		reimbDetailId: `${uuidv4()}`,
		reimbursementId: reimbursement.flexReimbursementId,
		GSI5: employee.lastName, //lastname
		GSI6: employee.firstName, //firstname
		date: formatDate(reimbDetail.date),
	};
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
