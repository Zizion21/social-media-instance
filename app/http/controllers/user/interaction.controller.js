const { UserModel } = require("../../../models/users.model");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { objectIdValidator } = require("../../validators/public.validator");

class InteractionController {
  async follow(req, res, next) {
    try {
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
    } catch (error) {
      next(error);
    }
  }

  async unfollow(req, res, next) {
    try {
      const { id: targetUserID } = await objectIdValidator.validateAsync({
        id: req.params.targetUserID,
      });
      const originUserID = req.user._id;
      const targetUser = await UserModel.findById(targetUserID);
      if (!targetUser) throw createError.NotFound("User does not exist❗");
      if (req.user.followings.includes(targetUserID)) {
        req.user.followings.pull(targetUserID);
        await req.user.save();
      } else
        throw createError.BadRequest(
          `You do not follow ${targetUser.username}`
        );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  InteractionController: new InteractionController(),
};
