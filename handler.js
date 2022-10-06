const AWS = require("aws-sdk");
const serverless = require("serverless-http");
const express = require("serverless-express/express");

const app = express();
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

module.exports.handler = serverless(app);