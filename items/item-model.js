const mongoose = require("../db-connect");

const itemSchema = mongoose.Schema({
    name: {
        type: String,
    },
    brand: {
        type: String,
    },
    category: {
        type: String,
    },
    size: {
        type: Number
    },
    quantity: {
        type: Number
    },
    slno: {
        type: Number
    }
});

const items = mongoose.model("items", itemSchema);

module.exports = items;