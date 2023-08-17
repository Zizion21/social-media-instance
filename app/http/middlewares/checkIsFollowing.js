const {StatusCodes: HttpStatus} = require('http-status-codes');
const { objectIdValidator } = require('../validators/public.validator');

module.exports = async function checkIsFollowing (req, res, next){
    const originUser = req.user;
    const { id: targetUserID } = await objectIdValidator.validateAsync({
        id: req.params.targetUserID,
      });
    let isFollowing = originUser.isFollowing(targetUserID);
    if(isFollowing == true) return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        data: {
            isFollowing: true
        }
    })
    next()
}