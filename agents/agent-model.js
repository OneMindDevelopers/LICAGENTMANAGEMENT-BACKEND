const mongoose = require("../db-connect");

const nomineeSchema = mongoose.Schema({
    name: {
        type : String,
    },
    phone : {
        type : Number,
    },
    address: {
        type: String,
    },
    relationship: {
        type: String,
    }
})

const agentSchema = mongoose.Schema({
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
    nominee: nomineeSchema,
    agentID: {
        type: String,
        required: [true, "Agent ID required"],
        unique: true
    }
    
});

const agents = mongoose.model("agents", agentSchema);

module.exports = agents;