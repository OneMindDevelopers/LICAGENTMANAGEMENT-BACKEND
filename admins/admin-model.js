const mongoose = require("../db-connect");

const adminSchema = mongoose.Schema({
    name: {
        type : String,
        required: [true, "Name required"]
    },
    email: {
        type : String,
        unique : true,
        required: [true, "Email required"]
    },
    phone : {
        type : Number,
        required : [true, "Mobile number required"],
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    confirmPassword : {
        type : String,
        required : true
    },
});

const admins = mongoose.model("admins", adminSchema);

module.exports = admins;