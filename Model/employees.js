const { employeesSchema } = require('../schemas/employees.schema');
const mongoose = require("mongoose");

const employees = mongoose.model("employees", employeesSchema);



module.exports = employees;
