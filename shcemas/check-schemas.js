import Joi from "joi";
// Create check schema
const createCheckValidationSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().uri().required(),
  protocol: Joi.string().valid("HTTP", "HTTPS", "TCP").required(),
  path: Joi.allow(),
  port: Joi.allow(),
  webhook: Joi.allow(),
  timeout: Joi.number().allow(),
  interval: Joi.number().allow(),
  threshold: Joi.number().allow(),
  authentication: Joi.allow(),
  tags: Joi.array().items(Joi.string()).allow(),
});

// Update check schema
const updateCheckValidationSchema = Joi.object({
  name: Joi.string().allow(),
  url: Joi.string().uri().allow(),
  protocol: Joi.string().valid("HTTP", "HTTPS", "TCP").allow(),
  path: Joi.allow(),
  port: Joi.allow(),
  webhook: Joi.allow(),
  timeout: Joi.number().allow(),
  interval: Joi.number().allow(),
  threshold: Joi.number().allow(),
  authentication: Joi.allow(),
  tags: Joi.array().items(Joi.string()).allow(),
});

export { createCheckValidationSchema, updateCheckValidationSchema };
