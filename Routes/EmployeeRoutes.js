const responses = require("../Helpers/responsesHelper");
const DbEmployees = require("../DataAccess/Database/DbEmployees");
const jwtHelper = require("../Helpers/jwtHelper");

let EmployeeRoutes = { getDetails };
module.exports = EmployeeRoutes;

async function getDetails(req, res, next){
    //TODO: fix db calls
    //TODO: fix roles
    try {
        const userId = req.params.userId;
        const reimbursementId = req.params.reimbursementId;
    
        await DbEmployees.getEmployeeDetailsByEmail(userId, reimbursementId);
        res.status(200).json({
            ...responses.OkResponseBuilder("OK"),
            data: {
                firstName: employee.FirstName,
                lastName: employee.LastName,
                role: employee.Role,
            },
        });
    }
    catch(error) {
        next(error);
    }
    
}
