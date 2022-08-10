const mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectId;
const salarySchema = mongoose.Schema(
    {
        employee_id: {
            type: ObjectId,ref: 'employees',
            required: true,
            minlength: 5,
            maxlength: 50
        },
        first_name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        last_name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        pan_number: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        department: {
            type: String,
            required: false,
            minlength: 3,
            maxlength: 200
        },
        doj: {
            type: Date,
            required: true
        },
        salary: {
            type: Number,
            required: true
        },
        deleted_at: { type: Date, default: '' },
        created_by: { type: String, default: '' },
        created_at: { type: Date, default: Date.now },
        updated_by: { type: String, default: '' },
        updated_at: { type: Date, default: '' }
    }
);

module.exports = { salarySchema, mongoose };