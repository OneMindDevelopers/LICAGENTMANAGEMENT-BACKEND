const express = require("express");
const Customers = require("./customer-model");
const Agents = require("../agents/agent-model");
const validate = require("../validate");
const joi = require("joi");

const router = express.Router();

// api to fetch agent information based on agentID or customer phone number
router.post("/fetchAgent", async (req, res) => {
    const input = req.body.input;
    console.log("input -->", input)
    // "input": "XCV12333",
    // "input": "9449611122"
    if (/^[0-9]+$/.test(input)) {
        console.log("its phone number");
        const phone = input;
        Customers.findOne({ phone }, async (err, response) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (response) {
                    res.status(200).send({
                        name: response.name,
                        agentID: response.cus_agent_id,
                        agentExist: true
                    });
                } else {
                    res.status(200).send({
                        data: "Agent Not Found",
                        agentExist: false
                    });
                }
            }
        })
    } else {
        console.log("its agent id")
        const agentID = input;
        Agents.findOne({ agentID }, async (err, response) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (response) {
                    res.status(200).send({
                        name: response.name,
                        agentID: response.cus_agent_id,
                        agentExist: true
                    });
                } else {
                    res.status(200).send({
                        data: "Agent Not Found",
                        agentExist: false
                    });
                }
            }
        })
    }
});

// Fetch Agents customers 
router.post("/fetchAgentCustomers", async (req, res) => {
    const cus_agent_id = req.body.AgentId;

    Customers.find({ cus_agent_id }, async (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (response) {
                res.status(200).send(response);
            } else {
                res.send("Customers Not Found...")
            }
        }
    })
});

// To Save Customer data
router.post("/save", async (req, res) => {
    const phone = req.body.phone;
    const customer = {
        name: req.body.name,
        phone,
        cus_agent_id: req.body.agentID
    }
    Customers.findOne({ phone }, async (err, response) => {
        if (err) {
            res.send(err);
        } else {
            if (response) {
                res.status(200).send("Customer already exists.");
            } else {
                try {
                    const add = await addCustomer(customer);
                    res.status(200).send("Record created successfully.");
                } catch (err) {
                    res.status(500).send(err);
                }
            }
        }
    })
});

const addCustomer = (customer) => {
    return new Promise((resolve, reject) => {
        const newCustomer = new Customers(customer);
        newCustomer.save((err, user) => {
            if (err) {
                if (err.index === 0 && err.code === 11000) {
                    reject({ status: 422, message: 'User already exist!' });
                }
            } else {
                resolve(user)
            }
        })
    })
}

module.exports = router;