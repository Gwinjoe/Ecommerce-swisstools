const Joi = require("joi");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&]{8,}$/

exports.signupSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().min(6).max(60).required().email({ tlds: ["com", "net"] }),
  password: Joi.string().required().pattern(new RegExp(passwordRegex)),
})

exports.signinSchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email({ tlds: ["com", "net"] }),
  password: Joi.string().required().pattern(new RegExp(passwordRegex)),
})

exports.emailSchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email({ tlds: ["com", "net"] })
});

exports.verificationCodeSchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email({ tlds: ["com", "net"] }),
  code: Joi.string().required(),
})

exports.FPCodeSchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email({ tlds: ["com", "net"] }),
  code: Joi.string().required(),
  password: Joi.string().required().pattern(new RegExp(passwordRegex)),
})

exports.changePasswordSchema = Joi.object({
  password: Joi.string().required().pattern(new RegExp(passwordRegex)),
  password: Joi.string().required().pattern(new RegExp(passwordRegex)),
})
