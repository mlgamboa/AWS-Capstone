const AWS = require("aws-sdk");
const serverless = require("serverless-http");
const express = require("serverless-express/express");

const app = express();
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get("/", (req, res, next) => {
	return res.status(200).json({
		message: "Hello from root!",
	});
});

app.get("/hello", (req, res, next) => {
	return res.status(200).json({
		message: "Hello from path!",
	});
});

app.post("/post", (req, res, next) => {
	const bodyObj = JSON.parse(req.body.toString());
	console.log(bodyObj);
	console.log(req.headers.authorization);
	return res.status(200).json({
		message: "Hello from post!",
	});
});

module.exports.handler = serverless(app);
