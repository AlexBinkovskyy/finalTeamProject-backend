import { User } from "../models/userModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { passRecoveryHtmlTemplate } from "../helpers/statickHtml/passRecovetyHtmlTemplate.js";

export const checkUserByEmail = async ({ email }) =>
  await User.findOne({ email });

export const createUser = async (userData) => {
  userData.password = await bcrypt.hash(userData.password, 10);
  userData.verificationToken = crypto
    .createHash("md5")
    .update(Date.now().toString())
    .digest("hex");
  const newUser = new User(userData);
  await updateUserWithToken(newUser, newUser._id);
  await newUser.save();
  newUser.password = undefined;
  return newUser;
};

const updateUserWithToken = async (newUser, id) =>
  (newUser.token = jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  }));

const createResetPasswordToken = (user) => {
  const resetToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "5min",
  });
  user.resetToken = resetToken;
  return user;
};

export const findVerifiedToken = async (verificationToken) => {
  return await User.findOne(
    { verificationToken },
    { verificationToken: 1, verify: 1 }
  );
};

export const checkTokenPlusUser = async (id, token) => {
  const user = await User.findById(id, { password: 0, verificationToken: 0 });
  if (!user.isVerified) return false;
  const comparetokens = user.token === token ? true : false;
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
  const emailConfig = {
    host: process.env.POST_SERVICE_HOST,
    port: process.env.POST_SERVICE_PORT,
    secure: true,
    auth: {
      user: process.env.POST_SERVICE_USER,
      pass: process.env.POST_SERVICE_PASSWORD,
    },
  };

  const { email, verificationToken, token } = user;

  const transporter = nodemailer.createTransport(emailConfig);
  const emailOptions = {
    from: process.env.POST_SERVICE_USER,
    to: email,
    subject: "EMAIL VERIFICATION CODE",
    text: "verivication link",
    html: passRecoveryHtmlTemplate(
      `https://finalteamproject-backend.onrender.com/confirm.html?${verificationToken}&${token}`
      // `http://localhost:10000/confirm.html?${verificationToken}&${token}`
    ),
  };
  await transporter
    .sendMail(emailOptions)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

export const recoveryEmailService = async (user) => {
  const emailConfig = {
    host: process.env.POST_SERVICE_HOST,
    port: process.env.POST_SERVICE_PORT,
    secure: true,
    auth: {
      user: process.env.POST_SERVICE_USER,
      pass: process.env.POST_SERVICE_PASSWORD,
    },
  };

  const result = createResetPasswordToken(user);
  updateUser(result);

  const transporter = nodemailer.createTransport(emailConfig);
  const emailOptions = {
    from: process.env.POST_SERVICE_USER,
    to: user.email,
    subject: "Password recovery link",
    text: "Password recovery link",
    html: passRecoveryHtmlTemplate(
      result.resetToken
      // `http://localhost:10000/confirm.html?${verificationToken}&${token}`
    ),
  };
  await transporter
    .sendMail(emailOptions)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

export const checkUserCreds = async (creds) => {
  const result = await checkUserByEmail(creds);
  if (!result) return false;
  const comparepass = await bcrypt.compare(creds.password, result.password);
  return comparepass && result.isVerified ? result : false;
};

export const login = async (user) => {
  const { _id } = user;
  const userToken = await updateUserWithToken(user, _id);
  const loggedUser = await User.findByIdAndUpdate(
    _id,
    { token: userToken },
    { new: true }
  ).select("-password -verificationToken");
  return {
    token: loggedUser.token,
    user: {
      _id: loggedUser._id,
      name: loggedUser.name,
      email: loggedUser.email,
      gender: loggedUser.gender,
      dailyNorma: loggedUser.dailyNorma,
      weight: loggedUser.weigth,
      activeTyme: loggedUser.activeTime,
      goal: loggedUser.goal,
      avatarUrl: loggedUser.avatarUrl,
      isVerified: loggedUser.isVerified,
    },
  };
};

export const updateUser = async (user) => {
  const result = await User.findByIdAndUpdate(user._id, user, {
    new: true,
  }).select("-password -verificationToken -resetToken");
  return result;
};
