import {User} from '../models/userModel.js'
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { htmlTemplate } from '../helpers/htmlTemplate.js';

export const checkUserByEmail = async ({ email }) => {
  return await User.findOne(
    { email },
    { password: 1, email: 1, verify: 1, verificationToken: 1 }
  );
};

export const createUser = async (userData) => {
  userData.password = await bcrypt.hash(userData.password, 10);
  userData.verificationToken = crypto
    .createHash("md5")
    .update(Date.now().toString())
    .digest("hex");
  const newUser = new User(userData);
  await newUser.save();
  newUser.password = undefined;
  return newUser.toJSON();
};

export const findVerifiedToken = async (verificationToken) => {
  return await User.findOne(
    { verificationToken },
    { verificationToken: 1, verify: 1 }
  );
};

export const checkTokenPlusUser = async (id, dbToken) => {
  const user = await User.findById(id, { password: 0 });
  if (!user) return false;
  const comparetokens = user.token === dbToken ? true : false;
  return comparetokens ? user : false;
};

export const changeVerificationCreds = async (creds) => {
  creds.verificationToken = "";
  creds.isVerified = true;
  return await User.findByIdAndUpdate(creds._id, creds, { new: true });
};

export const deleteTokenFromUser = async (userData) => {
  userData.token = null;
  const user = await User.findByIdAndUpdate(userData.id, userData, {
    new: true,
  });
  return user ? true : false;
};

export const emailService = async (user) => {
  const { email, verificationToken } = user;

  const config = {
    host: process.env.POST_SERVICE_HOST,
    port: process.env.POST_SERVICE_PORT,
    secure: true,
    auth: {
      user: process.env.POST_SERVICE_USER,
      pass: process.env.POST_SERVICE_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);
  const emailOptions = {
    from: process.env.POST_SERVICE_USER,
    to: email,
    subject: "EMAIL VERIFICATION CODE",
    text: "verivication link",
    html: htmlTemplate(
      `https://finalteamproject-backend.onrender.com/index.html?${verificationToken}`
    ),
  };
  await transporter
    .sendMail(emailOptions)
    .then((info) => console.log("1", info))
    .catch((err) => console.log("2", err));
};
