const {
  AuthController,
} = require("../../http/controllers/auth/auth.controller");
const { uploadImage } = require("../../utils/multer");

const router = require("express").Router();

router.post(
  "/register",
  uploadImage.single("profile_image"),
  AuthController.register
);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/reset-password", AuthController.sendResetPasswordReq);
router.post("/reset-password/:userID/:token", AuthController.resetPassword);
module.exports = {
  AuthRoutes: router,
};
