const Joi = require("joi");

const registerValidator = Joi.object({
    username: Joi.string().pattern(/^[a-z]+[a-z0-9\_\.]{4}/).required().error(new Error('Enter a valid username.')),
    password: Joi.string().required().min(6).error(new Error('Enter atleast 6 character for password.')),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().error(new Error('Password and confirm password do not match.')),
    email: Joi.string().email().error(new Error('Enter a valid email address.')).allow(''),
    mobile: Joi.string().pattern(/^09[0-9]{9}$/).error(new Error('Enter a valid phone number.')).allow(''),
    image: Joi.string().error(new Error('Upload an image.')).allow(''),
    first_name: Joi.string().allow(''),
    last_name: Joi.string().allow(''),
    birthday: Joi.string().allow(''),
    profile_image: Joi.string().allow('')
    
});

const loginValidator = Joi.object({
    username: Joi.string().pattern(/^[a-z]+[a-z0-9\_\.]{4}/).required().error(new Error('Enter a valid username.')),
    password: Joi.string().required().min(6).error(new Error('Enter atleast 6 character for password.')),
});

const resetPassValidator = Joi.object({
    email: Joi.string().email().error(new Error('Enter a valid email address.')).allow(''),
});

const updateUserInfoValidator = Joi.object({
    username: Joi.string().allow('').pattern(/^[a-z]+[a-z0-9\_\.]{4}/).error(new Error('Enter a valid username...')),
    email: Joi.string().email().error(new Error('Enter a valid email address.')).allow(''),
    mobile: Joi.string().pattern(/^09[0-9]{9}$/).error(new Error('Enter a valid phone number.')).allow(''),
    profile_image: Joi.string().error(new Error('Upload an image.')).allow(''),
    first_name: Joi.string().allow(''),
    last_name: Joi.string().allow(''),
    birthday: Joi.string().allow(''),
    profile_image: Joi.string().allow('')
})
module.exports= {
    registerValidator,
    loginValidator,
    updateUserInfoValidator,
    resetPassValidator,
}