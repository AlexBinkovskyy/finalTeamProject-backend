import HttpError from "../helpers/HttpError.js";
import { uploadImage } from "../midleWares/fileHandler.js";
import {
  changeVerificationCreds,
  checkUserByEmail,
  checkUserCreds,
  createUser,
  emailService,
  findVerifiedToken,
  login,
  recoveryEmailService,
  updateUser,
} from "../services/userService.js";

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
  res.status(200).json(loggedUser);
};

export const getCurrentUserCreds = async (req, res, next) => {
  res.status(200).json({
    token: req.user.token,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      gender: req.user.gender,
      dailyNorma: req.user.dailyNorma,
      weight: req.user.weigth,
      activeTyme: req.user.activeTime,
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
    token: req.user.token,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      gender: req.user.gender,
      dailyNorma: req.user.dailyNorma,
      weight: req.user.weigth,
      activeTyme: req.user.activeTime,
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
