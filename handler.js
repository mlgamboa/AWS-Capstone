const AWS = require("aws-sdk");
const serverless = require("serverless-http");
const express = require("serverless-express/express");

const app = express();
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const errorHelper = require("./Helpers/errorHelper");
const userRoutes = require("./Routes/userRoutes");

app.use(express.json());

app.post("/login", userRoutes.login);
app.get("/logout", userRoutes.logout);

// ------------------- Tentative pwestuhan ng code. For Reference sa pag 'get' -----------------------
app.get('/reimburesement/:userId/:reimbursementId', async function (req, res) {
    try {
      const params = {
        TableName: REIMBURSEMENT_TABLE,
        KeyConditionExpression: 'PK = :PK AND SK = :SK',
        ExpressionAttributeValues: {
          ':PK':`EMP#${req.params.userId}`,
          ':SK':`RMBRSMNT#${req.params.reimbursementId}`
        },
      };
      const data  = await dynamoDbClient.query(params).promise();
      console.log(data);
      if (data) {
        res.status(200).json({
          message: "Success",
          data: data
        });
      } else {
        res
          .status(404)
          .json({ error: 'Not Found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  })
// -------------------------------------------------------------------------------------------------



// app.get("/", (req, res, next) => {
// 	return res.status(200).json({
// 		message: "Hello from root!",
// 	});
// });

// app.get("/hello", (req, res, next) => {
// 	return res.status(200).json({
// 		message: "Hello from path!",
// 	});
// });

// app.post("/post", (req, res, next) => {
// 	const bodyObj = JSON.parse(req.body.toString());
// 	console.log(bodyObj);
// 	console.log(req.headers.authorization);
// 	return res.status(200).json({
// 		message: "Hello from post!",
// 	});
// });

app.use(errorHelper.logErrorsToConsole);
app.use(errorHelper.clientErrorHandler);
app.use(errorHelper.errorHandler);

module.exports.handler = serverless(app);
