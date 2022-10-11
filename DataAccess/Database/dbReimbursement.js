const AWS = require("aws-sdk");
const FileReimbursementTransaction = require("../Files/fileReimbursementTransaction");

const dbReimbursement = {
	getLatestDraftByEmpId,
	add,
	updateReimbursementAmount,
	updateReimbursementSubmitted,
	getReimbursementByCutoffId,
	getReimbursmentAndDetailsByReimbursementId,
	getReimbursmentAndDetailsByEmployee,
	getSubmittedReimbursementsByEmployeeId,
	approveReimbursement,
	rejectReimbursement,
	getReimbursentAndDetails,
};
module.exports = dbReimbursement;

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const REIMBURSEMENT_TABLE = process.env.REIMBURSEMENT_TABLE;

async function getLatestDraftByEmpId(empId) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			IndexName: "PK-GSI4_SK-index",
			KeyConditionExpression: "PK = :pk and GSI4_SK = :gsi4sk",
			ProjectionExpression: "amount, CTF_id, RMBRSMNT_id", // -- to filter out the output
			ExpressionAttributeValues: {
				":pk": `EMP#${empId}`,
				":gsi4sk": `EMP#${empId}#draft`,
			},
		};
		const singleResultArr = await dynamoDbClient.query(params).promise();

		let reimbursement = null;
		if (singleResultArr.Items.length === 1) {
			reimbursement = {
				totalReimbursementAmount: parseInt(
					singleResultArr.Items[0].amount
				),
				flexCutoffId: singleResultArr.Items[0].CTF_id,
				flexReimbursementId: singleResultArr.Items[0].RMBRSMNT_id,
			};
		}
		return reimbursement;
	} catch (error) {
		console.log(error);
	}
}

async function add(detail) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			Item: detail,
		};
		const singleResultArr = await dynamoDbClient.put(params).promise();
		return singleResultArr;
	} catch (error) {
		console.log(error);
	}
}

async function updateReimbursementAmount(empId, reimbursementId, totalAmount) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			Key: { PK: `EMP#${empId}`, SK: `RMBRSMNT#${reimbursementId}` },
			UpdateExpression: "set amount = :amt",
			ExpressionAttributeValues: {
				":amt": totalAmount,
			},
		};
		const singleResultArr = await dynamoDbClient.update(params).promise();
		return singleResultArr;
	} catch (error) {
		console.log(error);
	}
}

async function updateReimbursementSubmitted(
	empId,
	reimbursementId,
	transaction_number
) {
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		Key: { PK: `EMP#${empId}`, SK: `RMBRSMNT#${reimbursementId}` },
		UpdateExpression:
			"set RMB_status = :sts, transaction_number = :tn, GSI4_SK = :gsi4sk",
		ConditionExpression: "(RMB_status in (:sts2))",
		ExpressionAttributeValues: {
			":sts": "submitted",
			":sts2": "draft",
			":tn": transaction_number,
			":gsi4sk": `EMP#${empId}#submitted`,
		},
		ReturnValues: "ALL_OLD",
	};

	let singleResult;
	try {
		singleResult = await dynamoDbClient.update(params).promise();
	} catch (error) {
		console.log(error.code);
		console.log(error);
	}
	return singleResult;
}

async function getReimbursementByCutoffId(cutoffId) {
	// US009
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		IndexName: "CTF_id-SK-index",
		KeyConditionExpression: "CTF_id = :ctf AND begins_with(SK, :sk)",
		ExpressionAttributeValues: {
			":ctf": `${cutoffId}`,
			":sk": "RMBRSMNT#",
		},
	};
	const data = await dynamoDbClient.query(params).promise();
	return data;
}

async function getReimbursmentAndDetailsByReimbursementId(reimbursementId) {
	// US0010
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		IndexName: "RMBRSMNT_id-SK-index",
		KeyConditionExpression: "RMBRSMNT_id = :id AND begins_with(SK, :sk)",
		ExpressionAttributeValues: {
			":id": `${reimbursementId}`,
			":sk": `RMBRSMNT#${reimbursementId}`,
		},
		ProjectionExpression:
			"SK, RMB_status, amount, transaction_number, CTF_id, date_submitted, tin_of_establishment, name_of_establishment, or_number, category",
	};
	const data = await dynamoDbClient.query(params).promise();
	return data;
}

async function getReimbursmentAndDetailsByEmployee(
	cutoffId,
	employeeId,
	lastName,
	firstName
) {
	// US0011
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		IndexName: "GSI6_PK-SK-index",
		KeyConditionExpression: "GSI6_PK = :ctf AND begins_with(SK, :sk)",
		FilterExpression:
			"PK = :pk OR begins_with(last_name, :ln) OR begins_with(first_name, :fn)",
		ExpressionAttributeValues: {
			":ctf": `${cutoffId}`,
			":sk": "RMBRSMNT#",
			":pk": `EMP#${employeeId}`,
			":ln": `${lastName}`,
			":fn": `${firstName}`,
		},
		ProjectionExpression:
			"SK, RMB_status, amount, transaction_number, CTF_id, date_submitted, tin_of_establishment, name_of_establishment, or_number, category, PK, first_name, last_name",
	};
	const data = await dynamoDbClient.query(params).promise();
	return data;
}
async function getSubmittedReimbursementsByEmployeeId(employeeId) {
	try {
		const params = {
			TableName: REIMBURSEMENT_TABLE,
			KeyConditionExpression: "PK = :PK and begins_with(SK, :sk)",
			FilterExpression: "RMB_status = :status",
			ExpressionAttributeValues: {
				":PK": `EMP#${employeeId}`,
				":sk": "RMBRSMNT#",
				":status": "submitted",
			},
		};
		const data = await dynamoDbClient.query(params).promise();
		return data;
	} catch (error) {}
}

async function approveReimbursement(params) {
	try {
		const approveItems = params.map(async item => {
			await dynamoDbClient.update(item).promise();
		});

		await Promise.all(approveItems);
	} catch (error) {
		console.log(error);
	}
}

async function rejectReimbursement(params) {
	try {
		const rejectItems = params.map(async item => {
			await dynamoDbClient.update(item).promise();
		});

		await Promise.all(rejectItems);
	} catch (error) {
		console.log(error);
	}
}

async function getReimbursentAndDetails(empId, reimbursementId) {
	const params = {
		TableName: REIMBURSEMENT_TABLE,
		KeyConditionExpression: "PK = :pk and  begins_with(SK, :sk)",
		ExpressionAttributeValues: {
			":pk": `EMP#${empId}`,
			":sk": `RMBRSMNT#${reimbursementId}`,
		},
	};

	const queryResult = await dynamoDbClient.query(params).promise();

	let data = queryResult.Items;

	console.log(data);

	let transaction = null;
	let detailsArr = [];
	let categories = [];

	data.forEach(item => {
		if (item.SK === `RMBRSMNT#${reimbursementId}`) {
			transaction = item;
		} else {
			detailsArr.push(item);
			if (categories.indexOf(item.category) === -1) {
				categories.push(item.category);
			}
		}
	});

	if (transaction) {
		await FileReimbursementTransaction.print(
			transaction,
			detailsArr,
			categories
		);
	}

	return data;
}
