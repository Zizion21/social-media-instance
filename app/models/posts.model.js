const { default: mongoose } = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    caption: { type: String, required: true },
    picture: { type: String, required: true },
    tags: { type: [String], default: [] },
    likes: { type: [mongoose.Types.ObjectId], ref: "user", default: [] },
    comments: { type: [commentSchema], default: [] },
    isShown: { type: Boolean, default: true },
  },
  {
    id: false,
    timestamps: true,
    toJSON:{
      virtuals: true
    }
  }
);

postSchema.methods.isLiked = function(userID){
  return this.likes.includes(userID)
}

module.exports = {
  PostModel: mongoose.model("post", postSchema),
};
