const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");

//Schema define the structure of the document(documents means rows in sql)  and validation and default values etc.

// A Mongoose model is a wrapper on the Mongoose schema.

// A Mongoose schema defines the structure of the document,

// default values, validators, etc., whereas a Mongoose model 

// provides an interface to the database for creating,

// querying, updating, deleting records, etc.
const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true, minlength: 5, maxlength: 50 },
        last_name: { type: String, required: true, minlength: 5, maxlength: 50 },
        email: { type: String, unique: true, required: true, minlength: 5, maxlength: 255 },
        password: { type: String, required: true, minlength: 8, maxlength: 1024 },
        created_by: { type: String, default: '' },
        created_at: { type: Date, default: Date.now },
    }
);

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
        },
        process.env.JWT_PRIVATE_KEY
    );
    return token;
};

module.exports = userSchema;