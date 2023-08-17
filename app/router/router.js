const { checkLogin } = require("../http/middlewares/checkLogin");
const { verifyAccessToken } = require("../http/middlewares/verifyAccessToken");
const { AuthRoutes } = require("./auth/auth.routes");
const { PostRoutes } = require("./user/post.routes");
const { UserRoutes } = require("./user/user.routes");
const router = require("express").Router();

router.use('/auth', AuthRoutes);
router.use('/user', checkLogin, verifyAccessToken, UserRoutes);


module.exports= {
    AllRoutes: router
}
