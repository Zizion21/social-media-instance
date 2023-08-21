const { default: mongoose } = require("mongoose");

const notificationSchema = new mongoose.Schema({
    sender: {type: mongoose.Types.ObjectId, ref: 'user', required: true},
    notificationText: {type: String},
    isAccepted: {type: Boolean, default: false}
},{ 
    id: false,
    timestamps: true,
    toJSON:{
        virtuals: true
    }
})

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String},
    email: {type: String, unique: true},
    mobile: {type: String, unique: true},
    first_name: {type: String},
    last_name: {type: String},
    birthday: {type: String, default: ''},
    profile_image: {type: String, default: ''},
    followers: {type: [mongoose.Types.ObjectId], ref: 'user', default: []},
    followings: {type: [mongoose.Types.ObjectId], ref: 'user', default: []},
    notifications: {type: [notificationSchema], default: []},
    token: {type: String, default: ""},
    posts: {type: [mongoose.Types.ObjectId], ref: 'post', default: []},
    bio: {type: String, default: ''},
    isPrivate: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
}, {
    id: false,
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

// userSchema.virtual('isFollowed', {
//     ref: 'user',
//     localField: '_id',
//     foreignField: 'followings',
//     justOne: false
// })

userSchema.methods.isFollowing = function (targetUserID){
    return this.followings.includes(targetUserID)
}

module.exports = {
    UserModel: mongoose.model('user', userSchema)
}