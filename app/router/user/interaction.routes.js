const { InteractionController } = require('../../http/controllers/user/interaction.controller');
const checkIsFollowing = require('../../http/middlewares/checkIsFollowing');
const { checkLogin } = require('../../http/middlewares/checkLogin');
const { verifyAccessToken } = require('../../http/middlewares/verifyAccessToken');
const router = require('express').Router();

//Get target user profile
router.get('/:targetUserID', InteractionController.getUserByID)
//Follow accounts
router.patch('/:targetUserID/follow', checkIsFollowing, InteractionController.follow);
//Unfollow accounts
router.patch('/:targetUserID/unfollow', InteractionController.unfollow)

module.exports = {
    InteractionRoutes : router
}