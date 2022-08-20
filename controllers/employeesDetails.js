
const employees = require('../Model/employees');
const salary = require('../Model/salary');
const helper = require('../helper')
const { default: mongoose } = require('mongoose');
const attendance = require('../Model/attendance');
const Constant = require('../Constant');
let date = new Date().toISOString();
let isoDate = new Date(date);

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

        let employeeDetails = await employees.find({}, ['first_name', 'last_name', 'address', 'department', 'doj']).skip(offset).limit(items);
        res.success(employeeDetails);
    } catch (error) {
        res.success([], 404, error.message)
    }
}


async function updateEmployeeDetails(req, res) {
    let result = await employees.updateOne({ _id: req.body._id }, { $set: req.body.updated_records });

    res.success(result);
}

async function getExcelFile(req, res) {
    let employeeDetails = await employees.find({}).select({ "first_name": 1, "last_name": 1, "address": 1, "department": 1, "_id": 0 });;

    req.employeeDetails = employeeDetails;
    helper.arrayToExcel(req, res);
}

async function addSalary(req, res) {

    try {

        var salaryDetails = {
            "employee_id": req.body.employee_id,
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "pan_number": req.body.pan_number,
            "department": req.body.department,
            "doj": req.body.doj,
            "email": req.body.email,
            "salary": req.body.salary,
        }

        let data = await salary.create(salaryDetails);
        res.success({ "res": data });
    }
    catch (error) {
        res.success([], 404, error.message);
    }
}

async function attendanceOpertaion(req, res) {

    try {
        switch (req.body.module) {
            case Constant.ATTENDANCE:
                const requestForMarkAbsent = {
                    'employee_id': mongoose.Types.ObjectId(req.body.employee_id),
                    'absent_date': new Date(req.body.absent_date)
                }

                await attendance.attendanceModel.create(requestForMarkAbsent);

                break;

            case Constant.UPDATE_ATTENDANCE:

                const updateAttendanceDetails = {
                    'employee_id': mongoose.Types.ObjectId(req.body.employee_id),
                    'absent_date': req.body.absent_date
                }

                await attendance.attendanceModel.updateOne({ 'employee_id': mongoose.Types.ObjectId(req.body.employee_id), }, updateAttendanceDetails);

            case Constant.DELETE_ATTENDANCE:

                const deleteAttendanceRequest = {
                    'employee_id': mongoose.Types.ObjectId(req.body.employee_id),
                    'absent_date': req.body.absent_date
                }
                await attendance.attendanceModel.deleteOne(deleteAttendanceRequest);

            default:
                throw "Invalid Module";
        }

        res.success();
    } catch (error) {
        res.success([], 404, error.message);
    }
}

async function getTodayAbsentEmployee(req, res) {

    try {

        var items = req.body.no_of_record;
        var page_no = req.body.page_number;
        var offset = page_no * items - items;
        let filters = {};

        if (typeof req.body.filters === 'object') {
            if (typeof req.body.filters.absent_date !== 'undefined') {
                filters['absent_date'] = req.body.filters.absent_date;
            }
        }

        console.log(filters);

        let arg = {
            query: [
                {
                    $lookup: {
                        from: "attendances",
                        localField: "_id",
                        foreignField: "employee_id",
                        as: "attendances_details"
                    }
                },
                {
                    $unwind: '$attendances_details'
                },
                {
                    $addFields: {
                        absent_date: { $toDate: "$attendances_details.absent_date" },
                        employee_name: { $concat: ['$first_name', '$last_name'] }
                    }
                },
                {
                    $match: {
                        "attendances_details": { $ne: [] }, ...filters
                    }
                },
                { $limit: req.body.no_of_record },
                { $skip: offset },
                {
                    $project: {
                        absent_date: 1,
                        employee_name: 1,
                    }
                }


            ]
        }

        const employeeDetails = await employees.aggregate(arg.query);
        res.success(employeeDetails);
    } catch (error) {
        res.success([], 404, error.message);
    }



}

module.exports = {
    getExcelFile: getExcelFile,
    addEmployees: addEmployees,
    getEmployeeList: getEmployeeList,
    updateEmployeeDetails: updateEmployeeDetails,
    addSalary: addSalary,
    attendanceOpertaion: attendanceOpertaion,
    getTodayAbsentEmployee: getTodayAbsentEmployee
}