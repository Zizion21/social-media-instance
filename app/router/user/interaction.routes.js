const { InteractionController } = require('../../http/controllers/user/interaction.controller');
const checkIsFollowing = require('../../http/middlewares/checkIsFollowing');

const router = require('express').Router();

//Follow accounts
router.patch('/:targetUserID/follow', checkIsFollowing, InteractionController.follow);
//Unfollow accounts
router.patch('/:targetUserID/unfollow', InteractionController.unfollow)

module.exports = {
    FollowRoutes : router
}