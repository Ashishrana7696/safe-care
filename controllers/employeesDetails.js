
const employees = require('../Model/employees');

async function addEmployees(req, res) {
    try {

        //document creation 
        var employeesDetails = {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "pan_number": req.body.pan_number,
            "aadhar_number": req.body.aadhar_number,
            "pan_number": req.body.pan_number,
            "address": req.body.address,
            "department": req.body.department,
            "doj": req.body.doj,
            "phone_number": req.body.phone_number,
        }

        let result = await employees.create(employeesDetails);

        res.success(result);

    } catch (error) {
        res.success([], 404, error.message)
    }
}


async function getEmployeeList(req, res) {
    try {
        var items = req.body.no_of_record;
        var page_no = req.body.page_number;
        var offset = page_no * items - items;

        let employeeDetails = await employees.find({}, ['first_name', 'last_name', 'address', 'department','doj']).skip(offset).limit(items);
        res.success(employeeDetails);
    } catch (error) {
        res.success([], 404, error.message)
    }
}


async function updateEmployeeDetails(req, res) {
console.log(req.body._id);
console.log(req.body);
    let result = await employees.updateOne({ _id: req.body._id}, {$set: req.body.updated_records});

    res.success(result);
}

module.exports = {
    addEmployees: addEmployees,
    getEmployeeList: getEmployeeList,
    updateEmployeeDetails:updateEmployeeDetails
}