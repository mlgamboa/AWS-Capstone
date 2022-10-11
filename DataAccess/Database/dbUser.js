const AWS = require("aws-sdk");

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;

const dbAccounts = { getUserByCredentials };
module.exports = dbAccounts;

async function getUserByCredentials (email, password) {
    try {
        const params = {
            TableName: REIMBURSEMENT_TABLE,
            IndexName: 'email-password-index',
            KeyConditionExpression: 'email = :email and password = :password',
            ProjectionExpression: 'EMP_id, EMP_role, first_name, last_name, email, employee_number, password', // -- to filter out the output 
            ExpressionAttributeValues: {
                ':email':`${email}`,
                ':password': `${password}`
            }
        };
        const singleResultArr = await dynamoDbClient.query(params).promise();
        console.log(singleResultArr);

        let account = null;
        if (singleResultArr.Items.length === 1) {
            account = {
            email: singleResultArr.Items[0].email,
            employeeId: singleResultArr.Items[0].EMP_id,
            firstName: singleResultArr.Items[0].first_name,
            lastName: singleResultArr.Items[0].last_name,
            employeeNumber: singleResultArr.Items[0].employee_number,
            password: singleResultArr.Items[0].password,
            role: singleResultArr.Items[0].EMP_role,
            }
            
        }
        return account;
    }
    catch (error){
        console.log(error);
    }
}

