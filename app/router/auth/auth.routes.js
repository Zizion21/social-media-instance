const { AuthController } = require('../../http/controllers/auth/auth.controller');
const { uploadImage } = require('../../utils/multer');

const router = require('express').Router();

router.post('/register', uploadImage.single('profile_image'), AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken)
module.exports ={
    AuthRoutes: router
}