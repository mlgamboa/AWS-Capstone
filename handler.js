const serverless = require("serverless-http");
const express = require("serverless-express/express");

const app = express();

const reimbursementRoutes = require("./Routes/reimbursementRoutes");
const errorHelper = require("./Helpers/errorHelper");
const userRoutes = require("./Routes/userRoutes");
const hrRoutes = require("./Routes/hrRoutes");
const flexPointRoutes = require("./Routes/flexPointRoutes");
const jwtHelper = require("./Helpers/jwtHelper");
const hrRoutes = require("./Routes/hrRoutes");

app.use(express.json());

app.post("/login", userRoutes.login);
app.get("/logout", jwtHelper.verifyToken, userRoutes.logout);

app.post("/detail/file", jwtHelper.verifyToken, reimbursementRoutes.file);
app.delete(
	"/detail/delete",
	jwtHelper.verifyToken,
	reimbursementRoutes.deleteReimbDetail
);

app.get(
	"/reimbursement/submit",
	jwtHelper.verifyToken,
	reimbursementRoutes.submitReimbursement
);

app.get(
	"/reimbursements/cutoff",
	jwtHelper.verifyToken,
	hrRoutes.getReimbbyCutoff
);
app.get(
	"/reimbursements/reimbursement_details",
	jwtHelper.verifyToken,
	hrRoutes.getReimbDetails
);
app.get(
	"/reimbursements/employee",
	jwtHelper.verifyToken,
	hrRoutes.searchReimbByEmployee
);

app.put(
	"/reimbursement/approve-reimbursement",
	jwtHelper.verifyToken,
	hrRoutes.approveReimbursement
);
app.put(
	"/reimbursement/reject-reimbursement",
	jwtHelper.verifyToken,
	hrRoutes.rejectReimbursement
);

app.post(
	"/print-transaction",
	jwtHelper.verifyToken,
	reimbursementRoutes.printReimbursement
);

app.post(
	"/flexpoint",
	jwtHelper.verifyToken,
	flexPointRoutes.calculateFlexPoints
);

app.use(errorHelper.logErrorsToConsole);
app.use(errorHelper.clientErrorHandler);
app.use(errorHelper.errorHandler);

module.exports.handler = serverless(app);
