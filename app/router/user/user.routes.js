const { UserController } = require('../../http/controllers/user/user.controller');
const { checkLogin } = require('../../http/middlewares/checkLogin');
const getUpdatedKeys = require('../../http/middlewares/getUpdatedKeys');
const { verifyAccessToken } = require('../../http/middlewares/verifyAccessToken');
const { uploadImage } = require('../../utils/multer');
const { FollowRoutes } = require('./interaction.routes');
const { PostRoutes } = require('./post.routes');
const router = require('express').Router();

//Get user profile
router.get('/profile', UserController.getUserProfile);
//Update user info
router.patch('/update', getUpdatedKeys, uploadImage.single('profile_image'), UserController.updateUserInfo);
//Deleting account
router.delete('/delete-account', UserController.deleteAccount);
//Posts related routes
router.use('/posts', PostRoutes);
//Interaction with other users
router.use('/', FollowRoutes)

module.exports = {
    UserRoutes: router
}