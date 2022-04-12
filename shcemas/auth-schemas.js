import Joi from "joi";
// Sign up schema
const signupValidationSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().required(),
});

// Login schema
const loginValidationSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().required(),
});

// Verify validation
const verifyValidationSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  verificationCode: Joi.number().required(),
});

export {
  signupValidationSchema,
  loginValidationSchema,
  verifyValidationSchema,
};
