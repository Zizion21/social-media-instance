const { checkLogin } = require("../http/middlewares/checkLogin");
const { verifyAccessToken } = require("../http/middlewares/verifyAccessToken");
const { AuthRoutes } = require("./auth/auth.routes");
const { InteractionRoutes } = require("./user/interaction.routes");
const { UserRoutes } = require("./user/user.routes");
const router = require("express").Router();

router.use('/auth', AuthRoutes);
router.use('/user', checkLogin, verifyAccessToken, UserRoutes);
router.use('/', checkLogin, verifyAccessToken, InteractionRoutes)


module.exports= {
    AllRoutes: router
}
