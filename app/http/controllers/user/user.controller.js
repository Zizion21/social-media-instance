const createHttpError = require("http-errors");
const { UserModel } = require("../../../models/users.model");
const {
  deleteInvalidPropertiesOfObject,
  copyObject,
  deleteFileInPublic,
  deleteFolderInPublic,
  followUser,
} = require("../../../utils/functions");
const {
  updateUserInfoValidator,
} = require("../../validators/user/auth.validator");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const bcrypt = require("bcrypt");
const { findNotification } = require("../../../utils/notification");
require("express-async-errors");

class UserController extends Controller {
  async home(req, res, next) {
    const { _id } = req.user;
    const userFollowings = await UserModel.findOne({ _id })
      // .select({ _id: 1 })
      .populate({
        path: "followings",
        select: { _id:0, posts: 1 },
        populate: { 
          path: "posts", 
          select: { isShown: 0, __v: 0} ,
          match: {isShown : true}
        },
      })
    .sort("followings.posts.createdAt");
    // console.log(userFollowings.followings);
    return res.send(userFollowings.followings);
  }
  async getUserProfile(req, res, next) {
    const user = req.user;
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user: user,
      },
    });
  }
  async getNotifications(req, res, next) {
    const { _id } = req.user;
    const notifications = await UserModel.find({ _id })
      .select({ username: 1, _id: 0 })
      .populate([
        { path: "notifications.sender", select: { username: 1, _id: 0 } },
        { path: "notifications.notificationText" },
        { path: "notifications.isAccepted" },
        { path: "notifications.updatedAt" },
        { path: "notifications._id" },
      ]);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        notifications,
      },
    });
  }
  async confirmNotifications(req, res, next) {
    const { id: notifID } = req.params;
    const { isAccepted } = req.body;
    const user = req.user;
    const notification = await findNotification(user._id, notifID);
    const sender = notification.sender;
    if (isAccepted == "true") {
      const notificationUpdateResult = await UserModel.updateOne(
        { _id: user._id, "notifications._id": notifID },
        {
          $set: {
            "notifications.$.isAccepted": true,
            "notifications.$.notificationText": `${sender.username} is following you.`,
          },
        }
      );
      const followResult = await followUser(sender, user._id);
      if (notificationUpdateResult && followResult)
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {
            message: "Follow request accepted.",
          },
        });
    } else if (isAccepted == "false") {
      const deleteNotificationResult = await UserModel.updateOne(
        { _id: user._id },
        {
          $pull: {
            notifications: notifID,
          },
        }
      );
      if (deleteNotificationResult)
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {
            message: "Follow request removed.",
          },
        });
    }
  }
  async updateUserInfo(req, res, next) {
    const user = req.user;
    const { _id } = user;
    await updateUserInfoValidator.validateAsync(req.body);
    const data = copyObject(req.body);
    if (req?.file?.path) {
      const profileImage = req.file.path.replace(/\\/g, "/");
      data.profile_image = profileImage;
      deleteFileInPublic(user.profile_image);
    }
    deleteInvalidPropertiesOfObject(data, ["_id", "token", "isAdmin"]);
    const updateProfileResult = await UserModel.updateOne(
      { _id },
      { $set: data }
    );
    if (!updateProfileResult.modifiedCount)
      throw createHttpError.InternalServerError("Update user failed.");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "User profile updated successfully.",
      },
    });
  }
  async deleteAccount(req, res, next) {
    const id = req.user._id;
    const { username, password } = req.body;
    const user = await UserModel.findById(id);
    const userName = user.username;
    const comparePass = bcrypt.compareSync(password, user.password);
    if (username != user.username && !comparePass)
      throw { status: 400, message: "Incorrect data. please try again." };
    const deleteResult = await UserModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount == 0)
      throw createHttpError.InternalServerError(
        "Failed to delete the account. Please try again."
      );
    deleteFolderInPublic(userName);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "User deleted successfully.",
      },
    });
  }
}

module.exports = {
  UserController: new UserController(),
};
