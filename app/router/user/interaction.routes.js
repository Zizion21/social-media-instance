const { InteractionController } = require('../../http/controllers/user/interaction.controller');
const { checkIsNotFollowing, checkIsFollowing } = require('../../http/middlewares/checkIDExistsInArray');
const { sendFollowRequest } = require('../../http/middlewares/sendFollowReq');
const router = require('express').Router();

//Follow accounts
router.patch('/:targetUserID/follow', checkIsFollowing, sendFollowRequest, InteractionController.follow);
//Unfollow accounts
router.patch('/:targetUserID/unfollow', checkIsNotFollowing, InteractionController.unfollow)
//Get target user profile
router.get('/:targetUserID', InteractionController.getUserByID)

module.exports = {
    InteractionRoutes : router
}