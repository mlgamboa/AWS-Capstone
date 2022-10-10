const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const dbReimbDetails = require("../DataAccess/Database/dbReimbDetails");

const reimbursementHelper = {
	makeDraftReimbursement,
	calculateReimbursementAmount,
};
module.exports = reimbursementHelper;

async function makeDraftReimbursement(empId) {
	//TODO const cutoff = get get latest active cut off
	const latestFlexCycleCutoff = await dbFlexCycleCutoff.getLatestFlexCycle();
	await dbReimbursement.add(empId, latestFlexCycleCutoff.cutoffId);
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
