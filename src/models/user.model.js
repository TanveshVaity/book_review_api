import mongoose, { Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//define the user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
},{
    timestamps: true,
});

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// password compare method
userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//method to generate access token
userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
}

export const User = mongoose.model("User", userSchema)


//method to generate refresh token
// userSchema.methods.generateRefreshToken = function () {
//     return jwt.sign({
//         _id: this._id,
//     }, process.env.REFRESH_TOKEN_SECRET, {
//         expiresIn: "30d",
//     });
// }