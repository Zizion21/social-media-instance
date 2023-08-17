const createError = require("http-errors");
const Joi = require("joi");

const createPostValidator = Joi.object({
  caption: Joi.string().required().error(new Error("Add some text.")),
  picture: Joi.allow(),
  tags: Joi.array()
    .min(0)
    .max(20)
    .error(createError.BadRequest("Only 20 tags at the top is allowed❗")).allow(''),
});
const editPostValidator = Joi.object({
  caption: Joi.string().allow(''),
  tags: Joi.array()
    .min(0)
    .max(20)
    .error(createError.BadRequest("Only 20 tags at the top is allowed❗"))
    .allow(''),
  isShown: Joi.bool().allow(''),
});

module.exports = {
  createPostValidator,
  editPostValidator,
};
