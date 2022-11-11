const joi = require('joi');

function validateUser(user){
  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().min(10).max(255).required().email(),
    phone: joi.number().min(10).max(10).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: joi.ref('password'),
  });

//   return schema.validate(user);
  const result = joi.validate(user, schema);
  if(result.error){
    console.log(result.error);
  }
}

exports.validate = validateUser;