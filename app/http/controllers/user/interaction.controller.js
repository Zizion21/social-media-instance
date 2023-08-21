const { UserModel } = require("../../../models/users.model");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { objectIdValidator } = require("../../validators/public.validator");
const { followUser } = require("../../../utils/functions");
require("express-async-errors");

class InteractionController {
  async getUserByID(req, res, next) {
    const originUser = req.user;
    const { id: targetUserID } = await objectIdValidator.validateAsync({
      id: req.params.targetUserID,
    });
    const isFollowing = originUser.isFollowing(targetUserID);
    const targetUser = await UserModel.findById(targetUserID).select({
      _id: 0,
      username: 1,
      profile_image: 1,
      followers: 1,
      followings: 1,
      bio: 1,
      posts: 1
    });
    if (!targetUser) throw createError.NotFound("User does not exist❌");
    if (targetUser.isPrivate == true && isFollowing == false) {
      return res.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        data: { message: `${targetUser.username} account is private.` },
      });
    }
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        targetUser
      },
    });
  }

  async follow(req, res, next) {
    const originUser = req.user;
    const { targetUserID } = req.params;
    const targetUser = await UserModel.findById(targetUserID);
    const followProcess = followUser(originUser, targetUserID);
    if (followProcess)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: `You are following ${targetUser.username}✨`,
        },
      });
  }

  async unfollow(req, res, next) {
    const originUserID = req.user._id;
    const { id: targetUserID } = await objectIdValidator.validateAsync({
      id: req.params.targetUserID,
    });
    await UserModel.findByIdAndUpdate(originUserID, {
      $pull: { followings: targetUserID },
    });
    await UserModel.findByIdAndUpdate(targetUserID, {
      $pull: { followers: originUserID },
    });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "You unfollowed this user successfully✔️",
      },
    });
  }
}

module.exports = {
  InteractionController: new InteractionController(),
};
