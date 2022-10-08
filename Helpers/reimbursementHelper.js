const dbReimbursement = require("../DataAccess/Database/dbReimbursement");
const jwtHelper = require("../Helpers/jwtHelper");

const reimbursementHelper = {};
module.exports = reimbursementHelper;

async function makeDraftReimbursement(empId) {
	//TODO get employee id from db using
	//TODO const cutoff = get get latest active cut off
	await dbReimbursement.add(empId, cutoff.cutoffId);
}

async function hasDraftReimbursement() {
	//TODO return get draft reimbursement by emp id
}
