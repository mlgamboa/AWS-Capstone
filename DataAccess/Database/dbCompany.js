const AWS = require("aws-sdk");
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;
const dbCompany = { getCompanyByEmpId };
module.exports = dbCompany;

async function getCompanyByEmpId(empId) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			KeyConditionExpression: "PK = :PK AND SK = :SK",
			ProjectionExpression: "EMP_comp_code",
			ExpressionAttributeValues: {
				":PK": `EMP#${empId}`,
				":SK": `COMPANY`,
			},
		};
		const singleResultArr = await dynamoDbClient.query(params).promise();

		let company = null;
		if (singleResultArr.Items.length) {
			company = {
				code: singleResultArr.Items[0].EMP_comp_code,
			};
		}
		return company;
	} catch (error) {}
}
