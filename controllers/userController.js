import HttpError from "../helpers/HttpError.js";
import {
  changeVerificationCreds,
  checkUserByEmail,
  checkUserCreds,
  createUser,
  emailService,
  findVerifiedToken,
  login,
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
  res.status(200).json({
    loggedUser,
  });
};