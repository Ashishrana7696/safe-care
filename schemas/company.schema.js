const mongoose = require("mongoose");

const companySchema = mongoose.Schema(
    {
        company_name: {
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
        company_address: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 200
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

module.exports = { companySchema, mongoose };