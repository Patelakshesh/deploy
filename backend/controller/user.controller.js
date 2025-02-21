import { User } from "../models/User.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../utiles/emailService.js";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already exist with this email",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    const newUser = await User.create({
      fullname,
      email,
      password: hashPassword,
      role,
      verificationToken,
      verificationTokenExpires,
    });
    await newUser.generateUniquePin();
    await sendWelcomeEmail(email, fullname, verificationToken);

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    if(!user.isVerified){
        return res.status(400).json({
            message: "Email not verified",
            success: false,
        })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    if (role != user.role) {
      return res.status(400).json({
        message: `This email exists but does not belong to a ${role} account.`,
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try{
    return res.status(200).cookie("token", "", {maxAge: 0}).json({
      message: "Logout successfully",
      success: true,
    })
  }catch(error){
    console.log(error)
  }
}

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "old password is wrong",
        success: false,
      });
    }
    if (await user.isPasswordUsedBefore(newPassword)) {
      return res.status(400).json({
        message: "New password cannot be same as last 3 passwords",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHistory.unshift(user.password);
    user.passwordHistory = user.passwordHistory.slice(0, 3);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user || user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired token",
        success: false,
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return res
      .status(200)
      .json({
        message: "Email verified successfully. You can now log in.",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
