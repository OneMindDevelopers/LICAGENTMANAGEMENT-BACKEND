const express = require("express");
const admins = require("./admin-model");
const validate = require("../validate");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const config = require("config");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/getUsers", async (req, res) => {
  try {
    const users = await getUsers();
    const admins = users.map((item) => ({
      name: item.name,
      email: item.email,
      phone: item.phone,
    }));
    res.status(200).send(admins);
  } catch (error) {
    res.status(500).json({ message: "Some error", error: error });
  }
});

router.post("/login", async (req, res) => {
  // try {
  //   const admin = await getUser(req.body);
  //   if (admin) {
  //     const token = await jwt.sign(
  //       {
  //         name: admin.name,
  //         phone: admin.phone,
  //         email: admin.email,
  //       },
  //       config.get("jwtPrivateKey")
  //     );
  //     res.status(200).send(token);
  //   } else {
  //     res.status(404).send("User not found.");
  //   }
  // } catch (err) {
  //   res.status(500).send("Network error");
  // }
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let admin = await admins.findOne({ phone: req.body.phone });
    if (!admin) return res.status(400).send("Mobile Number is not registered.");

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassword) return res.status(400).send("Password is not correct");

    if (admin) {
      const token = await jwt.sign(
        {
          name: admin.name,
          phone: admin.phone,
          email: admin.email,
        },
        config.get("jwtPrivateKey")
      );
      res.status(200).send(token);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    res.status(500).send("Network error");
  }
});

router.post("/registration", async (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  try {
    const validate = await validateUser(newUser);
    if (validate) {
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      newUser.confirmPassword = await bcrypt.hash(
        newUser.confirmPassword,
        salt
      );
      const adduser = await addUser(newUser);
      res.status(200).send(adduser);
    }
  } catch (err) {
    res.status(err.status).send(err.message);
  }
});

router.post("/forgotPassword", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password,salt);
  const confirmPassword = await bcrypt.hash(req.body.confirmPassword,salt);
  const phone = req.body.phone;
  admins.findOneAndUpdate(
    { phone },
    { $set: { password, confirmPassword } },
    function (err, response) {
      if (err) {
        res.status(500).send("Failed to update, try again");
      } else {
        res.status(200).send("Record Updated Successfully");
      }
    }
  );
});

const validateLogin = (req) => {
  const schema = joi.object({
    phone: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });

  return schema.validate(req);
};

const validateUser = (user) => {
  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().min(10).max(255).required().email(),
    phone: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirmPassword: joi.ref("password"),
  });

  const result = schema.validate(user);
  if (result.error) {
    return {
      isValid: false,
      error: result.error.details[0].message,
    };
  } else {
    return (isValid = true);
  }
};

const addUser = (newUser) => {
  return new Promise((resolve, reject) => {
    const User = new admins(newUser);
    User.save((err, user) => {
      if (err) {
        if (err.index === 0 && err.code === 11000) {
          // Duplicate username
          reject({ status: 422, message: "User already exist!" });
        }
      } else {
        resolve(user);
      }
    });
  });
};

const getUsers = () => {
  return new Promise(function (resolve, reject) {
    admins.find({}, function (err, response) {
      if (response) {
        resolve(response);
      } else {
        resolve(false);
      }
    });
  });
};

const getUser = (data) => {
  return new Promise(function (resolve, reject) {
    admins.findOne(
      { phone: data.phone, password: data.password },
      function (err, response) {
        if (response) {
          resolve(response);
        } else {
          resolve(false);
        }
      }
    );
  });
};

module.exports = router;
