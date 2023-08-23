const {
  PostsController,
} = require("../../http/controllers/user/post.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadImage } = require("../../utils/multer");
const router = require("express").Router();

//Getting all posts of user
router.get("/", PostsController.gettingAllPosts);
//Creating new posts
router.post("/new", uploadImage.single("picture"), stringToArray('tags'), PostsController.newPost);
//Editing posts
router.patch("/edit/:id", stringToArray('tags'), PostsController.editPost);
//Deleting posts
router.delete("/delete/:id", PostsController.deletePostByID);
//Liking a post
router.patch('/:id/like', PostsController.likePostsByID)

module.exports = {
  PostRoutes: router,
};
