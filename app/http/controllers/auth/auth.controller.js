const { UserModel } = require("../../../models/users.model");
const {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  deleteInvalidPropertiesOfObject,
  randomNumberGenerator,
} = require("../../../utils/functions");
const {
  registerValidator,
  loginValidator,
  resetPassValidator,
} = require("../../validators/user/auth.validator");
const Controller = require("../controller");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const bcrypt = require("bcrypt");
require("express-async-errors");
const nodemailer = require("nodemailer");

class AuthController extends Controller {
  async register(req, res, next) {
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
  async login(req, res, next) {
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
  async refreshToken(req, res, next) {
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
  async resetPassword(req, res, next) {
    await resetPassValidator.validateAsync(req.body);
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) throw createError.NotFound("User does not exist❌");
    const code = randomNumberGenerator();
    let resetPassCode = {
      code,
      expiresIn: (new Date().getTime() + 120000),
      isConfirmed: false
    }
    deleteInvalidPropertiesOfObject(resetPassCode);
    const saveConfirmResetPassCodeResult = await user.updateOne({$set: {resetPassCode}});
    if(!saveConfirmResetPassCodeResult) throw createError.InternalServerError('Process failed⚠️')
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_HOST_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_HOST_USERNAME,
        pass: process.env.EMAIL_HOST_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: "Zizion's Scocial-Media-Instance",
      to: email,
      subject: "Reset Password!",
      text: `Hi ${user.username}✨
      This is an email for you to reset your password.
      Here is your code: ${code}`
    };
    transport.sendMail(mailOptions, (error, info) => {
      if (error) throw createError.InternalServerError(error);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          // messageID: info.messageId,
          message: `Email successfully sent to: ${info.envelope.to[0]}`,
        },
      });
    });
  }
}

module.exports = {
  AuthController: new AuthController(),
};
