const mongoose = require("mongoose");

const { companyMonthRangeSchema } = require("../schemas/companyVisitsMonthsRange.schema")

const companyMonthRange = mongoose.model("CompanyMonthRange", companyMonthRangeSchema);

module.exports = {
    companyMonthRange: companyMonthRange
}