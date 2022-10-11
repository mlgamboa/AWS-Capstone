const aws = require("aws-sdk");
const s3 = new aws.S3({ apiVersion: "2006-03-01" });

let FileReimbursementTransaction = { print };
module.exports = FileReimbursementTransaction;

const bucket = process.env.BUCKET;
const filePath = process.env.FILE_PATH;

async function print(transaction, reimbItemsArr, categories) {
	let transactionLastname = transaction.last_name.toLowerCase();
	let transactionFirstname = transaction.first_name
		.toLowerCase()
		.replace(" ", "");

	let date = formatDateNumbers(transaction.date_submitted);
	let fileName = `reimbursement_${transactionLastname}_${transactionFirstname}_${date}_${transaction.transaction_number}.txt`;

	let toWrite = `Employee Name:   ${transaction.last_name}, ${transaction.first_name}\n`;
	toWrite += `Employee Number:	${transaction.PK}\n`;
	toWrite += `Date Submitted:		${formatDateFull(transaction.date_submitted)}\n`;
	toWrite += `Transaction Number: ${transaction.transaction_number}\n`;
	toWrite += `Amount:	Php ${transaction.amount}\n`;
	toWrite += "Status:	Submitted\n\n";
	toWrite += "=== DETAILS ===\n";

	try {
		categories.forEach(category => {
			toWrite += `CATEGORY: ${category}\n`;
			let count = 1;
			let hasNoItemInCategory = true;
			reimbItemsArr.forEach(reimbItem => {
				if (reimbItem.category == category) {
					hasNoItemInCategory = false;
					toWrite += `Item # ${count}\n`;
					count++;
					toWrite += `Date: ${formatDateFull(
						reimbItem.date_submitted
					)}\n`;
					toWrite += `OR Number: ${reimbItem.or_number}\n`;
					toWrite += `Name of Establishment: ${reimbItem.name_of_establishment}\n`;
					toWrite += `TIN of Establishment: ${reimbItem.tin_of_establishment}\n`;
					toWrite += `Amount: Php ${reimbItem.amount}\n`;
					toWrite += "Status: Submitted\n\n";
				}
			});

			if (hasNoItemInCategory) {
				toWrite += "N/A\n\n";
			}
		});

		await uploadFile(toWrite, fileName);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

function formatDateNumbers(dateStrToFormat) {
	let date = new Date(dateStrToFormat);
	let year = date.getFullYear();
	let month = (date.getMonth() + 1).toString().padStart(2, "0");
	let dateDay = date.getDate();
	return `${month}${dateDay}${year}`;
}

function formatDateFull(dateStrToFormat) {
	const monthWords = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	let date = new Date(dateStrToFormat);
	let year = date.getFullYear();
	let month = date.getMonth();
	let dateDay = date.getDate();
	return `${monthWords[month]} ${dateDay}, ${year}`;
}

const uploadFile = async (fileData, fileName) => {
	const params = {
		Bucket: bucket,
		Key: filePath.concat(fileName),
		Body: fileData,
	};

	try {
		const printInfo = await s3.upload(params).promise();
		console.log(printInfo);
		return;
	} catch (err) {
		console.log(err);
	}
};
