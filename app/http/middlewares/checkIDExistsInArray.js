const { StatusCodes: HttpStatus } = require("http-status-codes");
const { objectIdValidator } = require("../validators/public.validator");
const { UserModel } = require("../../models/users.model");
const createError = require("http-errors");
const { PostModel } = require("../../models/posts.model");
require("express-async-errors");

async function checkIsFollowing(req, res, next) {
  const originUser = req.user;
  const { id: targetUserID } = await objectIdValidator.validateAsync({
    id: req.params.targetUserID,
  });
  const targetUser = await UserModel.findById(targetUserID);
  if (!targetUser) throw createError.NotFound("User does not exist❗");
  let isFollowing = originUser.isFollowing(targetUserID);
  if (isFollowing == true)
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        isFollowing: true,
      },
    });
  next();
}

async function checkIsNotFollowing(req, res, next) {
  const originUser = req.user;
  const { id: targetUserID } = await objectIdValidator.validateAsync({
    id: req.params.targetUserID,
  });
  const targetUser = await UserModel.findById(targetUserID);
  if (!targetUser) throw createError.NotFound("User does not exist❗");
  let isFollowing = originUser.isFollowing(targetUserID);
  if (isFollowing == false)
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        isFollowing: false,
      },
    });
  next();
}
// async function checkIsLiked(req, res, next) {
//   const { _id } = req.user;
//   const routePath = req.route.path;
//   const [id, route] = routePath.split('id');
//   const { id: postID } = await objectIdValidator.validateAsync(req.params);
//   const post = await PostModel.findById(postID);
//   if (!post) throw createError.NotFound("Post does not exist❗");
//   const isLiked = post.isLiked(_id);
//   if(isLiked == false && route == '/like'){

//   }
// }
module.exports = {
  checkIsFollowing,
  checkIsNotFollowing,
  // checkIsLiked,
};
