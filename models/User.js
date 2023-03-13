const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        require: false,
    },
    displayName : {
        type: String,
        require: false,
    }

},
 {timestamps: true}
);

module.exports =  mongoose.model("User", UserSchema);