const mongoose = require("mongoose");

const employeesSchema = mongoose.Schema(
    {
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
        aadhar_number: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        address: {
            type: String,
            required: true,
            minlength: 20,
            maxlength: 200
        },
        department: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200
        },
        doj: {
            type: Date,
            required: true
        },
        phone_number: {
            type: Number,
            required: true,
            validate: {
                validator: function (val) {
                    return val.toString().length === 9
                },
                message: val => `${val.value} has to be 9 digits`
            }
        },
        deleted_at: { type: Date, default: '' },
        created_by: { type: String, default: '' },
        created_at: { type: Date, default: Date.now },
        updated_by: { type: String, default: '' },
        updated_at: { type: Date, default: '' }
    }
);

module.exports = { employeesSchema, mongoose };