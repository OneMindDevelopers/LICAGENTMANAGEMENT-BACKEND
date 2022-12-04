const express = require("express");
const Agents = require("./agent-model");
const validate = require("../validate");
const joi = require("joi");
const router = express.Router();

router.post('/registration', async (req, res) => {
    const agent = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        nominee: {
            name: req.body.nominee.name,
            mobile: req.body.nominee.mobile,
            address: req.body.nominee.address,
            relationship: req.body.nominee.relationship
        },
    }
    const validate = await validateUser(agent);
    if (validate.isValid) {
        const agentID = req.body.agentID;
        agent.agentID = agentID;
        if (agent.agentID === 'NA') {
            Agents.find({}, async (err, response) => {
                if (err) {
                    res.status(500).send("Network error, try again")
                } else {
                    let count = response.length;
                    if (count > 0) {
                        agent.agentID = `AGT${count + 1}`
                        console.log("agent ", agent);
                    } else {
                        count = 1;
                        agent.agentID = `AGT${count}`
                    }
                    try {
                        const agents = await addAgents(agent);
                        res.status(200).send(agents)
                    } catch (err) {
                        res.status(err.status).send(err)
                    }
                }
            })
        }else{
            try {
                const agents = await addAgents(agent);
                res.status(200).send(agents)
            } catch (err) {
                res.status(err.status).send(err)
            }
        }
    } else {
        res.status(400).send(`Bad Request, ${validate.error}`)
    }
});

const validateUser = (agent) => {
    const user = {
        email: agent.email,
        phone: agent.phone
    };

    const schema = joi.object({
        email: joi.string().min(10).max(255).required().email(),
        phone: joi.string().length(10).pattern(/^[0-9]+$/).required(),
    });

    const result = schema.validate(user);
    if (result.error) {
        return {
            isValid: false,
            error: result.error.details[0].message
        }
    } else {
        return {
            isValid: true,
        }
    }
}

const addAgents = (agent) => {
    return new Promise((resolve, reject) => {
        const newAgent = new Agents(agent);
        newAgent.save((err, user) => {
            if (err) {
                if (err.index === 0 && err.code === 11000) {
                    reject({ status: 422, message: 'User already exist!', keyPattern: err.keyPattern});
                }
            } else {
                resolve(user)
            }
        })
    })
}

module.exports = router;