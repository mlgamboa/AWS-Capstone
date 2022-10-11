const serverless = require("serverless-http");
const express = require("serverless-express/express");

const app = express();

const reimbursementRoutes = require("./Routes/reimbursementRoutes");
const errorHelper = require("./Helpers/errorHelper");
const userRoutes = require("./Routes/userRoutes");
const jwtHelper = require("./Helpers/jwtHelper");


app.use(express.json());

app.post("/login", userRoutes.login);
app.get("/logout", jwtHelper.verifyToken,userRoutes.logout);

app.post("/file-detail", jwtHelper.verifyToken, reimbursementRoutes.file);
app.delete(
	"/delete-detail",
	jwtHelper.verifyToken,
	reimbursementRoutes.deleteReimbDetail
);

app.post(
	"/print-transaction",
	jwtHelper.verifyToken,
	reimbursementRoutes.printReimbursement
);


app.use(errorHelper.logErrorsToConsole);
app.use(errorHelper.clientErrorHandler);
app.use(errorHelper.errorHandler);

module.exports.handler = serverless(app);
