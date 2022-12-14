const audOpts = {
	EMPLOYEE_DETAILS: "EMPLOYEE_DETAILS",
	ADD_REIMB_TRANSACTION: "ADD_REIMB_TRANSACTION",
	FILE_REIMBURSEMENT_DETAIL: "FILE_REIMBURSEMENT_DETAIL",
	GET_REIMBURSEMENT_ITEM: "GET_REIMBURSEMENT_ITEM",
	GET_ALL_REIMBURSEMENT_ITEMS: "GET_ALL_REIMBURSEMENT_ITEMS",
	DELETE_REIMBURSEMENT_DETAIL: "DELETE_REIMBURSEMENT_DETAIL",
	SUBMIT_REIMBURSEMENT: "SUBMIT_REIMBURSEMENT",
	PRINT_REIMBURSEMENT: "PRINT_REIMBURSEMENT",
	CALCULATE_FLEX_POINTS: "CALCULATE_FLEX_POINTS",
	GET_REIMB_BY_CUTOFF: "GET_REIMB_BY_CUTOFF",
	GET_REIMB_DETAILS: "GET_REIMB_DETAILS",
	SEARCH_REIMB: "SEARCH_REIMB",
	APPROVE_REIMB: "APPROVE_REIMB",
	REJECT_REIMB: "REJECT_REIMB",
};

const EMPLOYEE_AUDIENCE = [
	audOpts.EMPLOYEE_DETAILS,
	audOpts.FILE_REIMBURSEMENT_DETAIL,
	audOpts.ADD_REIMB_TRANSACTION,
	audOpts.GET_REIMBURSEMENT_ITEM,
	audOpts.GET_ALL_REIMBURSEMENT_ITEMS,
	audOpts.DELETE_REIMBURSEMENT_DETAIL,
	audOpts.SUBMIT_REIMBURSEMENT,
	audOpts.CALCULATE_FLEX_POINTS,
	audOpts.PRINT_REIMBURSEMENT,
];
const HR_AUDIENCE = [
	...EMPLOYEE_AUDIENCE,
	audOpts.GET_REIMB_BY_CUTOFF,
	audOpts.GET_REIMB_DETAILS,
	audOpts.SEARCH_REIMB,
	audOpts.APPROVE_REIMB,
	audOpts.REJECT_REIMB,
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
