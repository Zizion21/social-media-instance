const { PostModel } = require("../../../models/posts.model");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { UserModel } = require("../../../models/users.model");
const {
  createPostValidator,
  editPostValidator,
} = require("../../validators/user/post.validator");
const { deleteInvalidPropertiesOfObject } = require("../../../utils/functions");
const { objectIdValidator } = require("../../validators/public.validator");

class PostsController {
  async gettingAllPosts(req, res, next) {
    try {
      const userID = req.user._id;
      const posts = await PostModel.find({ user: userID })
        .select({ __v: 0, isShown: 0, user: 0 })
        .sort({ _id: -1 });
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          posts,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getPostsByID(req, res) {
    await objectIdValidator.validateAsync({ id: req.params.id });
    const { id } = req.params;
    const post = await PostModel.findById(id)
      .select({ _id: 0, isShown: 0, __v: 0 })
      .populate([
        { path: "user", select: { username: 1, _id: 0 } },
        {
          path: "comments",
          populate: { path: "user", select: { username: 1, _id: 0 } },
        },
      ]);
    if (!post) throw createError.NotFound("Post does not exist❌");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        post,
      },
    });
  }
  async newPost(req, res, next) {
    try {
      const user = req.user._id;
      await createPostValidator.validateAsync(req.body);
      const { caption } = req.body;
      const postPic = req.file.path.replace(/\\/g, "/");
      const createPostResult = await PostModel.create({
        user,
        caption,
        picture: postPic,
      });
      const updateUserPosts = await UserModel.updateOne(
        { _id: user },
        { $push: { posts: createPostResult._id } }
      );
      if (!createPostResult && updateUserPosts.modifiedCount == 0)
        throw createError.InternalServerError(
          "Failed to create the post. Please try again."
        );
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: "Post created successfully✔️",
          createPostResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async editPost(req, res, next) {
    try {
      const postID = req.params.id;
      const post = await PostModel.findById(postID);
      if (!post) throw createError.NotFound("Post not found❗");
      await editPostValidator.validateAsync(req.body);
      deleteInvalidPropertiesOfObject(req.body, [
        "picture",
        "user",
        "likes",
        "comments",
      ]);
      const editPostResult = await PostModel.updateOne(
        { _id: postID },
        { $set: req.body }
      );
      if (editPostResult.modifiedCount == 0)
        throw createError.InternalServerError("Failed to update the post❗");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "Post updated successfully✔️",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async deletePostByID(req, res, next) {
    try {
      const { id: _id } = req.params;
      const userID = req.user._id;
      const post = await PostModel.findById(_id);
      if (!post) throw createError.NotFound("Post does not exist❗");
      const deletePostResult = await PostModel.deleteOne({ _id });
      await UserModel.updateOne({ _id: userID }, { $pull: { posts: _id } });
      if (deletePostResult.modifiedCount == 0)
        throw createError.InternalServerError("Failed to delete the post❌");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "Post deleted successfully✔️",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async likePostsByID(req, res) {
    const { _id: userID } = req.user;
    const { id: postID } = await objectIdValidator.validateAsync(req.params);
    const post = await PostModel.findById(postID);
    if (!post) throw createError.NotFound("Post not found");
    const isLiked = post.isLiked(userID);
    if (isLiked == false) {
      const likingPostResult = await PostModel.updateOne(
        { _id: postID },
        { $push: { likes: userID } }
      );
      if (!likingPostResult)
        throw createError.InternalServerError("Failed to like the post❌");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "You liked this post✨",
        },
      });
    }
    const dislikingPostResult = await PostModel.updateOne(
      { _id: postID },
      { $pull: { likes: userID } }
    );
    if (!dislikingPostResult)
      throw createError.InternalServerError("Failed to dislike the post❌");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "You disliked this post.",
      },
    });
  }
  async leaveCommentsByPostID(req, res) {
    const { _id: userID } = req.user;
    const { id: postID } = await objectIdValidator.validateAsync(req.params);
    const post = await PostModel.findById(postID);
    if (!post) throw createError.NotFound("Post not found");
    const { text } = req.body;
    const updatePostResult = await PostModel.updateOne(
      { _id: postID },
      {
        $push: {
          comments: {
            user: userID,
            text,
          },
        },
      }
    );
    if (!updatePostResult)
      throw createError.InternalServerError("Failed to send the comment❌");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "Comment sent successfully✔️",
      },
    });
  }
  async deleteCommentByID(req, res) {
    const userID = req.user._id;
    await objectIdValidator.validateAsync({
      id: req.params.id,
      id: req.params.commentID,
    });
    const { id, commentID } = req.params;
    const comment = await PostModel.findOne({ "comments._id": commentID });
    if (!comment) throw createError.NotFound("Comment does not exist❌");
    const deleteCommentResult = await PostModel.findOneAndUpdate(
      {
        _id: id,
        $and: [
          { user: userID },
          {comments: { $elemMatch: {_id: commentID, user: userID}}}
        ],
      },
      {
        $pull: { comments: { _id: commentID } },
      },
      { new: true }
    );
    if (!deleteCommentResult)
      throw createError.InternalServerError("Failed to delete the comment⚠️");
    else
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "Comment deleted successfully",
        },
      });
  }
}
module.exports = {
  PostsController: new PostsController(),
};
