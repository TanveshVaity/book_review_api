import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            username,
            email,
            password,
        });
        await newUser.save();

        const accessToken = newUser.generateAccessToken();

        res.status(201).json({
            newUser,
            accessToken,
            message: "User registered successfully",
        })
    } catch (error) {
        res.status(500).json({error,  message: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const isMatch = await existingUser.isPasswordMatch(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = existingUser.generateAccessToken();

        res.status(200).json({
            existingUser,
            accessToken,
            message: "User logged in successfully",
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


export {registerUser, loginUser};