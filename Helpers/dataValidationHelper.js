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
		reimbDetail.Amount,
		reimb.TotalReimbursementAmount,
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

	let newReimbTotal;
	if (itemAmountExceedsCap) {
		message +=
			"Adding this reimbursement item will exceed the maximum reimbursement amount for your flex cycle. ";
		errors.push("amount");
	} else {
		newReimbTotal = reimbDetail.Amount + reimb.TotalReimbursementAmount;
	}

	return {
		reimbDetail: {
			...reimbDetail,
			Date: formatDate(reimbDetail.Date),
		},
		newReimbTotal,
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
	return amount >= MIN_REIMBURSABLE_AMOUNT;
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
	return newTotal > flexCycle.CutoffCapAmount;
}

async function transactionAmountExceedsCapFn(
	totalReimbursementAmount,
	flexCutoffId
) {
	let flexCycle = await DbFlexCycleCutoff.getByFlexCycleId(flexCutoffId);
	return totalReimbursementAmount > flexCycle.CutoffCapAmount;
}

function formatDate(dateStr) {
	let dateToFormat = new Date(dateStr);

	return `${dateToFormat.getFullYear()}-${
		dateToFormat.getMonth() + 1
	}-${dateToFormat.getDate()}`;
}
