const mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectId;

const companyVisitEmployeesByDay = mongoose.Schema({
    company_id: { type: ObjectId, ref: 'company_detail' },
    service_type: {
        type: String,
        require: true
    },
    employee_id: { type: ObjectId, ref: 'employees' },
    day: {
        type: String,
        require: true
    },
    deleted_at: { type: Date, default: '' },
    created_by: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_by: { type: String, default: '' },
    updated_at: { type: Date, default: '' }
})

module.exports = {
    companyVisitEmployeesByDay: companyVisitEmployeesByDay
}