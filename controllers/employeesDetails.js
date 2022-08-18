
const employees = require('../Model/employees');
const salary = require('../Model/salary');
const helper = require('../helper')
const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../helpers/options');
const { debugPort } = require('process');
const {dbo}=require('../app.js');
// const data = require('../helpers/data');
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
    let result = await employees.updateOne({ _id: req.body._id}, {$set: req.body.updated_records});

    res.success(result);
}

async function getExcelFile(req,res) {
    let employeeDetails = await employees.find({}).select({ "first_name": 1, "last_name": 1, "address": 1, "department": 1,"_id": 0});;

    req.employeeDetails = employeeDetails;
    helper.arrayToExcel(req,res); 
}
const generatePdf = async (req, res, next) => {

    // console.log("dfdf==========================",dbo);
    var id1 = req.body.employee_id;
    const env                     = process.env;
    const html = fs.readFileSync(path.join(__dirname, '../views/salary.html'), 'utf-8');
    const filename = Math.random() + '_doc' + '.pdf';
    let array = [];

    // employees.find().populate('salary_deatils').exec(function(err, employees) {
    //     if (err) throw err;
    
    //     var adTimes = [];
    //     employees.forEach(function(employee) {
    //         employee.salary_deatils.forEach(function(salary_deatil) {
    //             adTimes.push(salary_deatil.adTime);
    //         });
    //     });
    
    //     response.send(adTimes); // adTimes should contain all addTimes from his friends
    // });




    const url = env.DB_CLOUD;
    var MongoClient = require('mongodb').MongoClient;
    // var url = "mongodb://127.0.0.1:27017/";

     MongoClient.connect(url, function(err, db) {
             if (err) throw err;
    var dbo = db.db("welcomedb");

            var dbo = db.db("test");
            // var query = { employee_id:id1 };
            dbo.collection('employees').aggregate([              
            { $lookup:
                {
                from: 'salary_details',
                localField: 'employee_id',
                foreignField: '_id',
                as: 'salarydetails'
                }
            } ,{
                '$match': {
                    'salarydetails.employee_id': id1
                }
              }
            ]).toArray(function(err, res) {
            if (err) throw err;
            console.log(JSON.stringify(res));
            db.close();
            });
        });
 

    const obj = {
        prodlist: array,
        // subtotal: subtotal,
        // tax: tax,
        // gtotal: grandtotal
    }
    const document = {
        html: html,
        data: {
            products: obj
        },
        path: './docs/' + filename
    }
    pdf.create(document, options)
        .then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        });
        const filepath = 'http://localhost:3000/docs/' + filename;

        res.render('download', {
            path: filepath
        });
}

async function addSalary(req,res){
 try{
    var salaryDetails={
        "employee_id":req.body.employee_id,
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "pan_number": req.body.pan_number,
        "department": req.body.department,
        "doj": req.body.doj,
        "email": req.body.email,
        "salary": req.body.salary,
        }
    let data=await salary.create(salaryDetails);
    res.success({"res":data});
    }
     catch(error){
    res.success([],404,error.message);
    }
}

module.exports = {
    getExcelFile:getExcelFile,
    // getPdfFile:getPdfFile,
    addEmployees: addEmployees,
    getEmployeeList: getEmployeeList,
    updateEmployeeDetails:updateEmployeeDetails,
    addSalary:addSalary,
    generatePdf
}