const express = require("express");
const Agents = require("./agent-model");
const validate = require("../validate");
const joi = require("joi");
const { route } = require("../admins/admin-route");

const router = express.Router();

router.post('/registration', async (req, res) => {
    const agent = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        nominee: {
            name: req.body.nominee.name,
            phone: req.body.nominee.phone,
            address: req.body.nominee.address,
            relationship: req.body.nominee.relationship
        },
        agentID: req.body.agentID
    }
    const validate = await validateUser(agent);
    if (validate.isValid) {
        try {
            const agents = await addAgents(agent);
            res.status(200).send(agents)
        } catch (err) {
            res.status(err.status).send(err.message)
        }
    }else{
        res.status(400).send(`Bad Request, ${validate.error}`)
    }
});

const validateUser = (agent) => {
    const user = {
        email: agent.email,
        agentID: agent.agentID,
        phone: agent.phone
    };

    const schema = joi.object({
        email: joi.string().min(10).max(255).required().email(),
        agentID: joi.string().min(5).max(100).required(),
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
                    reject({ status: 422, message: 'User already exist!' });
                }
            } else {
                resolve(user)
            }
        })
    })
}

module.exports = router;