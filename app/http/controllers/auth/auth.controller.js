const { UserModel } = require("../../../models/users.model");
const {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  deleteInvalidPropertiesOfObject,
  randomNumberGenerator,
  sendEmail,
} = require("../../../utils/functions");
const {
  registerValidator,
  loginValidator,
  emailValidator,
  passwordValidator,
} = require("../../validators/user/auth.validator");
const Controller = require("../controller");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const bcrypt = require("bcrypt");
require("express-async-errors");
const { TokenModel } = require("../../../models/resetPassToken.model");
const crypto = require("crypto");

class AuthController extends Controller {
  async register(req, res) {
    deleteInvalidPropertiesOfObject(req.body, [
      "_id",
      "followers",
      "followings",
      "posts",
      "token",
      "isAdmin",
    ]);
    await registerValidator.validateAsync(req.body);
    const {
      username,
      password,
      email,
      mobile,
      first_name,
      last_name,
      birthday,
    } = req.body;
    const hashedPass = hashPassword(password);
    const user = await UserModel.create({
      username,
      password: hashedPass,
      email,
      mobile,
      first_name,
      last_name,
      birthday,
    }).catch((err) => {
      console.log(err);
      if (err?.code == 11000) {
        throw { status: 400, message: "This user already exists." };
      }
    });
    if (!user)
      throw createError.InternalServerError(
        "Failed to create new user. Please try again."
      );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "Account successfully created.",
        userInfo: {
          user,
        },
      },
    });
  }
  async login(req, res) {
    await loginValidator.validateAsync(req.body);
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) throw createError.NotFound("User not found.");
    const passwordComparision = bcrypt.compareSync(password, user.password);
    if (!passwordComparision)
      throw createError.BadRequest("Username and password do not match.");
    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);
    user.token = accessToken;
    user.save();
    res.cookie("authorization", accessToken, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 1),
    });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        accessToken,
        refreshToken,
      },
    });
  }
  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    const userID = verifyRefreshToken(refreshToken);
    const newAccessToken = await signAccessToken(userID);
    const newRefreshToken = await signRefreshToken(userID);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        AccessToken: newAccessToken,
        RefreshToken: newRefreshToken,
      },
    });
  }
  async sendResetPasswordReq(req, res) {
    await emailValidator.validateAsync(req.body);
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) throw createError.NotFound("User does not exist❌");
    let token = await TokenModel.findOne({ userID: user._id });
    if (!token) {
      token = await TokenModel.create({
        userID: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
    }
    const link = `${process.env.BASE_URL}:${process.env.PORT}/auth/reset-password/${user._id}/${token.token}`;
    const mailOptions = {
      from: "Zizion's Scocial-Media-Instance",
      to: email,
      subject: "Reset Password.",
      text: `Hi ${user.username}
      Use this link: ${link} to reset your password`,
    };
    const info = await sendEmail(mailOptions);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: `Email successfully sent to ${info.envelope.to[0]}`,
      },
    });
  }

  async resetPassword(req, res) {
    await passwordValidator.validateAsync(req.body);
    const _id = req.params.userID;
    const sentToken = req.params.token;
    const user = await UserModel.findById(_id);
    if (!user) throw createError.BadRequest("Invalid or expired link❗");
    const token = await TokenModel.findOne({ userID: _id, token: sentToken });
    if (!token) throw createError.BadRequest("Invalid or expired link❗");
    const newPass = hashPassword(req.body.new_password);
    user.password = newPass;
    await user.save();
    await token.deleteOne();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "Password changed successfully✔️",
      },
    });
  }
}

module.exports = {
  AuthController: new AuthController(),
};
