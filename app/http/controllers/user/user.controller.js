const createHttpError = require("http-errors");
const { UserModel } = require("../../../models/users.model");
const {
  deleteInvalidPropertiesOfObject,
  copyObject,
  deleteFileInPublic,
  deleteFolderInPublic,
} = require("../../../utils/functions");
const {
  updateUserInfoValidator,
} = require("../../validators/user/auth.validator");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const bcrypt = require("bcrypt");
const path = require("path");

class UserController extends Controller {
  async getUserProfile(req, res, next) {
    try {
      const user = req.user;
      
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          "user":user.isFollowed
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateUserInfo(req, res, next) {
    try {
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
    } catch (error) {
      next(error);
    }
  }
  async deleteAccount(req, res, next) {
    try {
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
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = {
  UserController: new UserController(),
};
