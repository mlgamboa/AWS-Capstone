const dbFlexCycleCutoff = require("../DataAccess/Database/dbFlexCycleCutoff");

let DataValidationHelper = {
	validateReimbursementDetail,
	validateTransaction,
	dateAfterCurrent,
	amountAboveMinimum,
	itemAmountExceedsCapFn,
	transactionAmountExceedsCapFn,
};
module.exports = DataValidationHelper;

async function validateReimbursementDetail(reimbDetail, reimb) {
	const isDateIncorrect = dateAfterCurrent(reimbDetail.date);
	const isAmountCorrect = amountAboveMinimum(reimbDetail.amount);
	// let category = await isCategoryCodeValid(reimbDetail.CategoryCode);
	const itemAmountExceedsCap = await itemAmountExceedsCapFn(
		reimbDetail.amount,
		reimb.totalReimbursementAmount,
		reimb.flexCutoffId
	);

	let message = "";
	let errors = [];

	if (isDateIncorrect) {
		message += "Invalid date. Date can't be later than today. ";
		errors.push("date");
	}

	if (!isAmountCorrect) {
		message += "Invalid amount. amount can't be lower than minimum. ";
		errors.push("amount");
	}

	// if (!category) {
	// 	message += "Invalid category code. ";
	// 	errors.push("category");
	// }

	if (itemAmountExceedsCap) {
		message +=
			"Adding this reimbursement item will exceed the maximum reimbursement amount for your flex cycle. ";
		errors.push("amount");
	}

	return {
		message,
		errors,
	};
}

async function validateTransaction(reimbTrans) {
	let transactionAmountExceedsCap = await transactionAmountExceedsCapFn(
		reimbTrans.TotalReimbursementAmount,
		reimbTrans.FlexCutoffId
	);

	let message = "";
	let errors = [];

	if (transactionAmountExceedsCap) {
		message += "Total transaction amount exceeds the cycle cutoff cap. ";
		errors.push("totalAmount");
	}

	return {
		message,
		errors,
	};
}

function dateAfterCurrent(dateStr) {
	let testDate = new Date(dateStr);
	let dateNow = new Date();
	return dateNow - testDate < 0 ? true : false;
}

function amountAboveMinimum(amount) {
	return amount >= process.env.MIN_REIMBURSABLE_AMOUNT;
}

// async function isCategoryCodeValid(categoryCode) {
// 	//TODO fix getting by category
// 	// let category = await DbCategory.getCategoryByCode(categoryCode);
// 	return category ? category : false;
// }

async function itemAmountExceedsCapFn(
	amount,
	totalReimbursementAmount,
	flexCutoffId
) {
	let flexCycle = await dbFlexCycleCutoff.getFlexCycleById(flexCutoffId);
	let newTotal = totalReimbursementAmount + amount;
	return newTotal > flexCycle.cutoffCapAmount;
}

async function transactionAmountExceedsCapFn(
	totalReimbursementAmount,
	flexCutoffId
) {
	let flexCycle = await DbFlexCycleCutoff.getByFlexCycleId(flexCutoffId);
	return totalReimbursementAmount > flexCycle.CutoffCapAmount;
}
