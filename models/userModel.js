import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: { type: String, enum: ["male", "female"] },
    dailyNorma: {type: Number, default: 1800},
    weigth: Number,
    activeTime: {type: Number,default: 2},
    goal: {type: Number, default: 1800},
    avatarUrl: {
      type: String,
      default:
        "https://finalteamproject-backend.onrender.com/icon/defaultAvatar.png",
    },
    token: String,
    isVerified: { type: Boolean, default: false },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    resetToken: {type: String, default: null},
  },
  { versionKey: false, timestamps: false }
);

export const User = model("user", userSchema);
