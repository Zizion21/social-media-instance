const { copyObject, deleteInvalidPropertiesOfObject } = require("../../utils/functions");

module.exports = async function getUpdatedKeys(req, res, next){
    const user = req.user;
    const reqBody = req.body;
    deleteInvalidPropertiesOfObject(reqBody);
    Object.keys(reqBody, user).forEach(key => {
        if(reqBody[key] == user[key]) {
            delete reqBody[key]
        }
    })
    return next();
}

