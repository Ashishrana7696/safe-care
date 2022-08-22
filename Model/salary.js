const { salarySchema } = require('../schemas/salary.schema');
const employees = require('../Model/employees');
const mongoose = require("mongoose");
const salary = mongoose.model("salary_detail", salarySchema);


async function getData(id)
  {
    
           return salary.aggregate([
            { 
              $lookup:
              {
               from: 'employees',
                localField: 'employee_id',
                foreignField: '_id',
                as: 'employeess'
              }
            },

            {
              $unwind: '$employeess'
            },

            {
              $addFields: 
              {
                  employee_name: '$employeess.first_name',
                  city: '$employeess.aadhar_number',
              }
            },
          
            {
              $project: 
              {       
                first_name: 1,
                department:1,
                employee_name:1,
                city:1,
                salary:1,
                employee_id:1,
                email:1
              },
              
            },
            { $match : { employee_id:mongoose.Types.ObjectId(id)} }
          ]);
  }
    
module.exports={
    salary:salary,
    getData:getData
}
