const { StatusCodes: HttpStatus } = require("http-status-codes");
const { UserModel } = require("../../models/users.model");

async function checkLogin(req, res, next) {
  try {
    const token = req.signedCookies["authorization"];
    if (token) {
      const user = await UserModel.findOne({ token });
      if (user) {
        req.user = user;
        return next();
      }
    }
    return res.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      data: {
        message: "To access to this section, log into your account first❗",
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkLogin,
};
