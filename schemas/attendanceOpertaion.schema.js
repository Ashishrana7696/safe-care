const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;


const attendanceSchema = mongoose.Schema({
    employee_id: { type: ObjectId, ref: 'employees' },
    absent_date: { type: Date, default: '' },
    deleted_at: { type: Date, default: '' },
    created_by: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_by: { type: String, default: '' },
    updated_at: { type: Date, default: '' }
})



module.exports = attendanceSchema;