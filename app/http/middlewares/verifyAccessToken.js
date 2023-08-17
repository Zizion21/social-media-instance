const createHttpError = require('http-errors');
const JWT = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET_KEY } = require('../../utils/constants');
const { UserModel } = require('../../models/users.model');

function getToken(headers){
    const [bearer, token] = headers?.authorization?.split(' ') || [];
    if( token && ['Bearer', 'bearer'].includes(bearer)) return token;
    throw createHttpError.Unauthorized('Unauthorized account❗ Please try again.')
}
function verifyAccessToken(req, res, next) {
    try {
        const token = getToken(req.headers);
        JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async(err, payload) => {
            try {
                if(err) throw createHttpError.Unauthorized('Log in to your account.');
                const {userID} = payload || {};
                const user = await UserModel.findById(userID);
                if(!user) throw createHttpError.NotFound('User not found.');
                req.user = user;
                return next();
            } catch (error) {
                next(error)
            }
        })
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    verifyAccessToken,
}