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
    dailyNorma: Number,
    weigth: Number,
    activeTime: Number,
    goal: Number,
    avatarUrl: {
      type: String,
      default:
        "https://finalteamproject-backend.onrender.com/icon/defaultAvatar.svg",
    },
    token: String,
    isVerified: { type: Boolean, default: false },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: false }
);

export const User = model("user", userSchema);
