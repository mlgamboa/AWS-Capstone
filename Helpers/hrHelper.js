const hrHelper = { formatReimbursement, formatDetail };
module.exports = hrHelper;

function formatReimbursement(reimbTrans) {
	reimbTrans.EmployeeName = `${reimbTrans.LastName}, ${reimbTrans.FirstName}`;
	let formattedDate = formatDate(reimbTrans.DateSubmitted);
	return {
		"Transaction number": reimbTrans.TransactionNumber,
		"Employee Number": reimbTrans.EmployeeNumber,
		"Employee Name ": reimbTrans.EmployeeName,
		"Amount to be reimbursed": reimbTrans.TotalReimbursementAmount,
		"Date Submitted": formattedDate,
		Status: reimbTrans.Status,
	};
}

function formatDetail(reimbItem) {
	let formattedDate = formatDate(reimbItem.Date);
	return {
		Date: formattedDate,
		"OR Number": reimbItem.OrNumber,
		"Name of establishment": reimbItem.NameEstablishment,
		"TIN of establishment": reimbItem.TinEstablishment,
		Amount: reimbItem.Amount,
		Category: reimbItem.CategoryName,
	};
}

function formatDate(dateToFormat) {
	let date = new Date(dateToFormat);
	let year = date.getFullYear();
	let month = (date.getMonth() + 1).toString().padStart(2, "0");
	let dateDay = date.getDate();
	return dateToFormat ? `${year}-${month}-${dateDay}` : null;
}
