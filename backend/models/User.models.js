import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    passwordHistory: [{ type: String }],
    pin: {
      type: String,
      unique: true,
    },
    isVerified: { type: Boolean, default: false }, 
    verificationToken: { type: String }, 
    verificationTokenExpires: { type: Date },
    isWelcomeEmailSent: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

userSchema.methods.isPasswordUsedBefore = async function (newPassword) {
  for (let oldPassword of this.passwordHistory) {
    const isMatch = await bcrypt.compare(newPassword, oldPassword);
    if (isMatch) return true;
  }
};
userSchema.methods.generateUniquePin = async function () {
  let pin;
  let isUnique = false;
  while (!isUnique) {
    pin = Math.floor(1000 + Math.random() * 9000).toString();
    const existingUser = await this.constructor.findOne({ pin });
    if (!existingUser) {
      isUnique = true;
    }
  }
  this.pin = pin;
  await this.save();
};

export const User = mongoose.model("User", userSchema);
