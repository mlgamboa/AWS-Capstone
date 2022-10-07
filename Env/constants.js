const audOpts = {
	EMPLOYEE_DETAILS: "EMPLOYEE_DETAILS",
	ADD_REIMB_TRANSACTION: "ADD_REIMB_TRANSACTION",
	FILE_REIMBURSEMENT_ITEM: "FILE_REIMBURSEMENT_ITEM",
	GET_REIMBURSEMENT_ITEM: "GET_REIMBURSEMENT_ITEM",
	GET_ALL_REIMBURSEMENT_ITEMS: "GET_ALL_REIMBURSEMENT_ITEMS",
	DELETE_REIMBURSEMENT_ITEM: "DELETE_REIMBURSEMENT_ITEM",
	SUBMIT_REIMBURSEMENT_TRANSACTION: "SUBMIT_REIMBURSEMENT_TRANSACTION",
	PRINT_TRANSACTION: "PRINT_TRANSACTION",
	CALCULATE_FLEX_POINTS: "CALCULATE_FLEX_POINTS",
	GET_REIMB_BY_CUTOFF: "GET_REIMB_BY_CUTOFF",
	GET_REIMB_DETAILS: "GET_REIMB_DETAILS",
	SEARCH_REIMB_TRANSACTION: "SEARCH_REIMB_TRANSACTION",
	APPROVE_REIMB_TRANSACTION: "APPROVE_REIMB_TRANSACTION",
	REJECT_REIMB_TRANSACTION: "REJECT_REIMB_TRANSACTION",
};

const EMPLOYEE_AUDIENCE = [
	audOpts.EMPLOYEE_DETAILS,
	audOpts.FILE_REIMBURSEMENT_ITEM,
	audOpts.ADD_REIMB_TRANSACTION,
	audOpts.GET_REIMBURSEMENT_ITEM,
	audOpts.GET_ALL_REIMBURSEMENT_ITEMS,
	audOpts.DELETE_REIMBURSEMENT_ITEM,
	audOpts.SUBMIT_REIMBURSEMENT_TRANSACTION,
	audOpts.CALCULATE_FLEX_POINTS,
	audOpts.PRINT_TRANSACTION,
];
const HR_AUDIENCE = [
	...EMPLOYEE_AUDIENCE,
	audOpts.GET_REIMB_BY_CUTOFF,
	audOpts.GET_REIMB_DETAILS,
	audOpts.SEARCH_REIMB_TRANSACTION,
	audOpts.APPROVE_REIMB_TRANSACTION,
	audOpts.REJECT_REIMB_TRANSACTION,
];
const PAYROLL_AUDIENCE = [...EMPLOYEE_AUDIENCE];

const JWT_OPTIONS = {
	EMPLOYEE_AUDIENCE,
	HR_AUDIENCE,
	PAYROLL_AUDIENCE,
};

module.exports = {
	JWT_OPTIONS,
	AUDIENCE_OPTIONS: audOpts,
};
