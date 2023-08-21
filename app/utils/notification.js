const { UserModel } = require("../models/users.model");

async function findNotification(userID, notifID) {
  const notification = await UserModel.findOne(
    { _id: userID, "notifications._id": notifID },
    { "notifications.$": 1 }
  );
  return notification?.notifications?.[0]
}

module.exports = {
  findNotification,
};
