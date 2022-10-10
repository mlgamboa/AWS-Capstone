const serverless = require("serverless-http");
const express = require("serverless-express/express");

const app = express();

const errorHelper = require("./Helpers/errorHelper");
const userRoutes = require("./Routes/userRoutes");

app.use(express.json());

app.post("/login", userRoutes.login);
app.get("/logout", userRoutes.logout);

app.use(errorHelper.logErrorsToConsole);
app.use(errorHelper.clientErrorHandler);
app.use(errorHelper.errorHandler);

module.exports.handler = serverless(app);
