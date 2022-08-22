
const employees = require('../Model/employees');
const salary = require('../Model/salary');
const helper = require('../helper')
const {attendanceModel}=require('../Model/attendance')
const { default: mongoose } = require('mongoose');
const attendance = require('../Model/attendance');
const Constant = require('../Constant');
let date = new Date().toISOString();
let isoDate = new Date(date);
const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../helpers/options');
// const { default: mongoose } = require('mongoose');
const nodemailer=require("nodemailer");
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
async function generatePdf(req, res){
    var employe_id = req.body.id;
    const html = fs.readFileSync(path.join(__dirname, '../views/paySlip.html'), 'utf-8');
    const filename = Math.random() + '_doc' + '.pdf';
    let employe_data=await salary.getData(employe_id);
    var month=isoDate.getMonth();
    var year=isoDate.getFullYear();
    let absentCount=await attendanceModel.find(
        { employee_id: mongoose.Types.ObjectId(employe_id) ,
        
            "$expr": {
                     $and:
                        [ 
                            { "$eq": [{ "$month": "$absent_date" }, month+1] },
                            { "$eq": [{ "$year": "$absent_date" }, year] } ,
                       
                        ] 
                       
                    }
                   
                }
      
        ).count();
      employe_data=employe_data[0];
      var net_salary=employe_data.salary-(employe_data.salary/30)*absentCount;
      console.log(net_salary);
      const document = {
        html: html,
        data: {
           result,
           net_salary
        },
        path: './docs/' + filename
    } 

     await pdf.create(document, options)
        .then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        });
        const filepath = Constant.FILE_PATH + filename;
        await res.render('download', {
            path: filepath
        });
        var message = "<p> Dear  Akash <br>With Greetings!<br><br><br>Please find here with attached 'SalarySlip' for the month of Jul 2022 with the IT <br>Computation for the period of 2022_23 according to investments declared by you.<br><br>Kindly check and write us in case of any clarification required.<br><br>Regards<br><br>Akash Singh <br>Head Accounts & Payroll Administration<br>Self Care Private Limited<br><br>******************Internet Email Confidentiality <br>Footer**************************************************************<br><br>The information contained in this communication is intended solely for the use <br>of the individual or entity to whom it is addressed and others authorized to receive <br>it. This communication may contain confidential or legally privileged information. <br>If you are not the intended recipient, any disclosure, copying, distribution or <br>action taken relying on the contents is prohibited and may be unlawful. If you have <br>received this communication in error, or if you or your employer does not consent to <br>email messages of this kind, please notify us immediately by responding to this <br>email and then delete it from your system. </p>";
         
     const msg={
                from:"ashish171154@gmail.com",
                to:result.email,
                subject:"Pay Slip",
                text:"new2",
                html:message,
                attachments: [{
                    filename: filename,
                    path: Constant.DOWNLOAD_PATH+filename,
                    contentType: 'application/pdf'
                }],
        }  
      nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:"abhishekdemo12@gmail.com",
            pass:"brsmhwlwqivefxfx"
          },
          port:465,
          host:'smtp.gmail.com'
      })
      .sendMail(msg,(err)=>{
        if(err){
            return console.log('error occurs',err);
        }
        else{
            return console.log('email sent');
        }
      })
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
            
            if (typeof req.body.filters.absent_date == 'string') {
                filters['attendances_details.absent_date'] = req.body.filters.absent_date;
            }
        }

       

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
                    $match: {
                        "attendances_details": { $ne: [] }, 
                         "attendances_details.absent_date":req.body.filters.absent_date
                    }
                },
                {
                    $addFields: {
                        absent_date: { $toDate: "$attendances_details.absent_date" },
                        employee_name: { $concat: ['$first_name', '$last_name'] }
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
    getTodayAbsentEmployee: getTodayAbsentEmployee,
    generatePdf:generatePdf

}