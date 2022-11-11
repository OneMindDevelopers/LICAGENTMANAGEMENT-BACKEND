const express = require("express");
const admins = require("./admin-model");
const validate = require("../validate");
const joi = require("joi");

const router = express.Router();

router.get('/getUsers', async (req, res) => {
    try {
        const users = await getUsers();
        const admins = users.map(item => ({
            name: item.name,
            email: item.email,
            phone: item.phone
        }))
        res.status(200).send(admins)
    } catch (error) {
        res.status(500).json({ message: "Some error", error: error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const admin = await getUser(req.body);
        if (admin) {
            res.status(200).send(admin)
        } else {
            res.status(404).send("User not found.")
        }
    } catch (err) {
        res.status(500).send("Network error")
    }
})

router.post('/registration', async (req, res) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    };

    try {
        const validate = await validateUser(newUser);
        if (validate) {
            const adduser = await addUser(newUser);
            res.status(200).send(adduser);
        }
    } catch (err) {
        res.status(err.status).send(err.message)
    }
});

router.post('/forgotPassword', (req, res) => {
    const phone = req.body.phone;
    const password = req.body.new_password;
    const confirmPassword = req.body.conf_pwd;
    admins.findOneAndUpdate({ phone }, { $set: { password, confirmPassword } }, function (err, response) {
        if (err) {
            res.status(500).send("Failed to update, try again")
        } else {
            res.status(200).send("Record Updated Successfully")
        }
    })
})

const validateUser = (user) => {
    const schema = joi.object({
        name: joi.string().min(3).max(50).required(),
        email: joi.string().min(10).max(255).required().email(),
        phone: joi.string().length(10).pattern(/^[0-9]+$/).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        confirmPassword: joi.ref('password'),
    });

    const result = schema.validate(user);
    if (result.error) {
        return {
            isValid: false,
            error: result.error.details[0].message
        }
    } else {
        return isValid = true;
    }
}

const addUser = (newUser) => {
    return new Promise((resolve, reject) => {
        const User = new admins(newUser);
        User.save((err, user) => {
            if (err) {
                if (err.index === 0 && err.code === 11000) {
                    // Duplicate username
                    reject({ status: 422, message: 'User already exist!' });
                }
            } else {
                resolve(user)
            }
        })
    })
}

const getUsers = () => {
    return new Promise(function (resolve, reject) {
        admins.find({}, function (err, response) {
            if (response) {
                resolve(response)
            } else {
                resolve(false);
            }
        })
    })
}

const getUser = (data) => {
    return new Promise(function (resolve, reject) {
        admins.findOne({ phone: data.phone, password: data.password }, function (err, response) {
            if (response) {
                resolve(response)
            } else {
                resolve(false);
            }
        })
    })
}

module.exports = router;