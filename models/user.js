import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    // username and passwords are handled by passport-local-mongoose
});

userSchema.plugin(passportLocalMongoose.default ?? passportLocalMongoose);
// This plugin adds username, hash and salt fields to store the username and the hashed password

const User = mongoose.model("User", userSchema);
export default User;  