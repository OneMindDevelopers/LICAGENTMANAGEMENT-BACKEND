const mongoose = require("../db-connect");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        index: true, 
        unique: true,
    },
    cus_agent_id: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

customerSchema.pre('save', function (next) {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    next();
});

const customers = mongoose.model("customers", customerSchema);

module.exports = customers;