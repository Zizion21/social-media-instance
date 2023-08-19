const { StatusCodes: HttpStatus } = require("http-status-codes");
const { objectIdValidator } = require("../validators/public.validator");
const { UserModel } = require("../../models/users.model");
const createError = require("http-errors");
require('express-async-errors');

async function checkIsFollowing(req, res, next) {
  const originUser = req.user;
  const { id: targetUserID } = await objectIdValidator.validateAsync({
    id: req.params.targetUserID,
  });
  const targetUser = await UserModel.findById(targetUserID);
  if(!targetUser) throw createError.NotFound('User does not exist❗')
  let isFollowing = originUser.isFollowing(targetUserID);
  if (isFollowing == true)
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        isFollowing: true,
      },
    });
  next();
}

async function checkIsNotFollowing(req, res, next) {
  const originUser = req.user;
  const { id: targetUserID } = await objectIdValidator.validateAsync({
    id: req.params.targetUserID,
  });
  const targetUser = await UserModel.findById(targetUserID);
  if(!targetUser) throw createError.NotFound('User does not exist❗')
  let isFollowing = originUser.isFollowing(targetUserID);
  if (isFollowing == false)
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        isFollowing: false,
      },
    });
  next();
}

module.exports = {
    checkIsFollowing,
    checkIsNotFollowing
}
