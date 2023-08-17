const { PostModel } = require("../../../models/posts.model");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { UserModel } = require("../../../models/users.model");
const {
  createPostValidator,
  editPostValidator,
} = require("../../validators/user/post.validator");
const { deleteInvalidPropertiesOfObject } = require("../../../utils/functions");

class PostsController {
  async gettingAllPosts(req, res, next) {
    try {
      const userID = req.user._id;
      const posts = await PostModel.find({ user: userID });
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
      await deleteInvalidPropertiesOfObject(req.body, [
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
      console.log(error);
      next(error);
    }
  }
}
module.exports = {
  PostsController: new PostsController(),
};
