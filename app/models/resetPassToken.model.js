const { default: mongoose } = require("mongoose");

const TokenSchema = new mongoose.Schema({
  userID: { type: mongoose.Types.ObjectId, res: "user", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, //60 mins
});

module.exports = { TokenModel: mongoose.model("token", TokenSchema) };
