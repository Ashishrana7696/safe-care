const { companySchema } = require('../schemas/company.schema');
const mongoose = require("mongoose");
const company = mongoose.model("company_detail", companySchema);

module.exports=company;