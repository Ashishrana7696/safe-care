const { salarySchema } = require('../schemas/salary.schema');
const mongoose = require("mongoose");
const salary = mongoose.model("salary_detail", salarySchema);

module.exports=salary;