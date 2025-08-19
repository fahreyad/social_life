import Joi from "joi";

export const userValidationSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().lowercase().email().required(),
  age: Joi.number().integer().min(0).default(18),
  gender: Joi.string().valid("male", "female", "other").required(),
  photo: Joi.string().uri().default("https://www.istockphoto.com/photos/default-image"),
  bio: Joi.string().allow("").default("").optional(),
  skills: Joi.array().items(
    Joi.string().custom((value, helpers) => {
      if (value.length < 2) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "Skill length validation")
  ).max(10).default([]),
  password: Joi.string().required()
});
