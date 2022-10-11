const serverless = require("serverless-http");
const express = require("serverless-express/express");

const app = express();

const reimbursementRoutes = require("./Routes/reimbursementRoutes");
const errorHelper = require("./Helpers/errorHelper");
const userRoutes = require("./Routes/userRoutes");
const jwtHelper = require("./Helpers/jwtHelper");

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

app.use(errorHelper.logErrorsToConsole);
app.use(errorHelper.clientErrorHandler);
app.use(errorHelper.errorHandler);

module.exports.handler = serverless(app);
