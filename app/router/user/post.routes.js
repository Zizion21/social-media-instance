const {
  PostsController,
} = require("../../http/controllers/user/post.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadImage } = require("../../utils/multer");
const router = require("express").Router();

//"post" is the prefix for all these routes
//Getting all posts of user
router.get("/", PostsController.gettingAllPosts);
//Getting a post by ID
router.get("/:id", PostsController.getPostsByID);
//Creating new posts
router.post("/new", uploadImage.single("picture"), stringToArray('tags'), PostsController.newPost);
//Editing posts
router.patch("/edit/:id", stringToArray('tags'), PostsController.editPost);
//Deleting posts
router.delete("/delete/:id", PostsController.deletePostByID);
//Liking a post
router.patch('/:id/like', PostsController.likePostsByID);
//Leaving comments
router.patch('/:id/leave-comments', PostsController.leaveCommentsByPostID);
//Deleting comments by postID and commentID. 
//Only post owner and the user who left the comment are allowed
router.patch('/:id/:commentID', PostsController.deleteCommentByID);

module.exports = {
  PostRoutes: router,
};
