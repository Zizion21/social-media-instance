const { UserModel } = require("../../models/users.model");
const {StatusCodes: HttpStatus} = require('http-status-codes')

async function sendFollowRequest(req, res, next){
    const {targetUserID} = req.params;
    const targetUser = await UserModel.findById(targetUserID);
    const sender = req.user;
    if(targetUser.isPrivate == true){
        targetUser.notifications.push({sender: sender._id, notificationText: `${sender.username} sent a request to follow you`});
        await targetUser.save();
        return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: {
                message: 'Follow request sent.'
            }
        })
    }
    next();
}

module.exports = {
    sendFollowRequest
}