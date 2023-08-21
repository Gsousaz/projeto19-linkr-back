import joi from "joi";

export const authSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string()
});

export const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  username: joi.string().required(),
  profile_image: joi.string().uri().required(),
});
