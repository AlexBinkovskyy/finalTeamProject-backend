import HttpError from "../helpers/HttpError.js";
import { uploadImage } from "../midleWares/fileHandler.js";
import { User } from "../models/userModel.js";
import {
  changeUserPassword,
  changeVerificationCreds,
  checkResetTokenPlusUser,
  checkUserByEmail,
  checkUserCreds,
  createUser,
  emailService,
  findVerifiedToken,
  login,
  recoveryEmailService,
  updateUser,
  updateUserWithRefreshToken,
  updateUserWithToken,
} from "../services/userService.js";
import jwt from "jsonwebtoken";

export const createNewUser = async (req, res, next) => {
  if (await checkUserByEmail(req.body))
    throw HttpError(409, "Current email already in use");
  req.body = await createUser(req.body);
  req.user = "new";
  next();
};

export const verificationTokenCheck = async (req, res, next) => {
  const checkToken = await findVerifiedToken(req.params.token);
  if (!checkToken) throw HttpError(404, "User not found");
  changeVerificationCreds(checkToken);
  res.status(200).json({ message: "Verification successful" });
};

export const sendVerificationEmail = async (req, res, next) => {
  const user = await checkUserByEmail(req.body);
  if (!user) throw HttpError(404, "User not found");
  if (!user.email) throw HttpError(400, "missing required field email");
  if (user.isVerified) throw HttpError(401);

  await emailService(user);

  if (req.user === "new") {
    res.status(201).json({
      user: {
        email: req.body.email,
        message: "Verification email sent",
      },
    });
  } else {
    res.status(200).json({
      message: "Verification email sent",
    });
  }
};

export const loginUser = async (req, res, next) => {
  const user = await checkUserCreds(req.body);
  if (!user) throw HttpError(401, "Email or password is wrong or not verified");
  const loggedUser = await login(user);

  res.cookie("refreshToken", loggedUser.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.json(loggedUser);
};

export const getCurrentUserCreds = async (req, res, next) => {
  res.status(200).json({
    accessToken: req.user.accessToken,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      gender: req.user.gender,
      dailyNorma: req.user.dailyNorma,
      weight: req.user.weight,
      activeTime: req.user.activeTime,
      goal: req.user.goal,
      avatarUrl: req.user.avatarUrl,
      isVerified: req.user.isVerified,
    },
  });
};

export const upload = async (req, res, next) => {
  uploadImage(req, res);
};

export const chahgeUserCreds = async (req, res, next) => {
  const updatedUser = { ...req.user._doc, ...req.body };
  req.user = await updateUser(updatedUser);
  res.status(201).json({
    accessToken: req.user.accessToken,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      gender: req.user.gender,
      dailyNorma: req.user.dailyNorma,
      weight: req.user.weight,
      activeTime: req.user.activeTime,
      goal: req.user.goal,
      avatarUrl: req.user.avatarUrl,
      isVerified: req.user.isVerified,
    },
  });
};

export const emailPassRecoveryController = async (req, res, nex) => {
  const user = await checkUserByEmail(req.body);

  if (!user) throw HttpError(404, "User not found");
  if (!user.email) throw HttpError(400, "missing required field email");

  await recoveryEmailService(user);
  res.json({
    message: "Recovery instructions was sent to provided email",
  });
};

export const recoveryPasswordController = async (req, res, next) => {
  const { resetToken, password } = req.body;
  try {
    const { id } = jwt.verify(resetToken, process.env.ACCESS_SECRET_KEY);
    const user = await checkResetTokenPlusUser(id, resetToken);
    if (!user) throw HttpError(401, "Not authorized");

    const updatedUser = await changeUserPassword(user, password);
    res.status(201).json({
      message: "Password changed successfuly",
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  const allUsers = await User.aggregate([
    {
      $match: {
        avatarUrl: {
          $ne: "https://finalteamproject-backend.onrender.com/icon/defaultAvatar.png",
        },
      },
    },
    { $sample: { size: 3 } },
    { $project: { avatarUrl: 1, _id: 0 } },
  ]);
  res.json({
    userCount: allUsers.length,
    userAvatars: allUsers,
  });
};

export const refreshPairToken = async (req, res, next) => {
  req.user.accessToken = await updateUserWithToken(req.user, req.user._id);
  req.user.refreshToken = await updateUserWithRefreshToken(
    req.user,
    req.user._id
  );
  
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.user, {
    new: true,
    fields: {
      accessToken: 1,
      refreshToken: 1,
      isVerified: 1,
    },
  });
  res.cookie("refreshToken", updatedUser.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.json(updatedUser);
};
