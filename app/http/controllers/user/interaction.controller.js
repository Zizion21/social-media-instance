const { UserModel } = require("../../../models/users.model");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { objectIdValidator } = require("../../validators/public.validator");
require("express-async-errors");

class InteractionController {
  async getUserByID(req, res, next) {
    const originUser = req.user;
    const { id: targetUserID } = await objectIdValidator.validateAsync({
      id: req.params.targetUserID,
    });
    const isFollowing = originUser.isFollowing(targetUserID);
    const targetUser = await UserModel.findById(targetUserID);
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
        targetUser,
      },
    });
  }

  async follow(req, res, next) {
    const originUser = req.user;
    const { targetUserID } = req.params;
    const targetUser = await UserModel.findById(targetUserID);
    if (!targetUser) throw createError.NotFound("User does not exist.");
    const addToFollowingsResult = await UserModel.updateOne(
      { _id: originUser._id },
      { $push: { followings: targetUserID } }
    );
    const addToFollowersResult = await UserModel.updateOne(
      { _id: targetUserID },
      { $addToSet: { followers: originUser._id } }
    );
    if (
      addToFollowingsResult.modifiedCount &&
      addToFollowersResult.modifiedCount
    )
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: `You are following ${targetUser.username}✨`,
        },
      });
  }

  async unfollow(req, res, next) {
    const { id: targetUserID } = await objectIdValidator.validateAsync({
      id: req.params.targetUserID,
    });
    const targetUser = await UserModel.findById(targetUserID);
    if (!targetUser) throw createError.NotFound("User does not exist❗");
    if (req.user.followings.includes(targetUserID)) {
      req.user.followings.pull(targetUserID);
      await req.user.save();
    } else
      throw createError.BadRequest(`You do not follow ${targetUser.username}`);
  }
}

module.exports = {
  InteractionController: new InteractionController(),
};
