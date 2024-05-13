import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  changeUserCredsSchema,
  registerLoginUserSchema,
  resendEmailSchema,
} from "../models/validationSchemas/userValidationSchema.js";
import {
  chahgeUserCreds,
  createNewUser,
  getCurrentUserCreds,
  loginUser,
  sendVerificationEmail,
  upload,
  verificationTokenCheck,
} from "../controllers/userController.js";
import { asyncWrapper } from "../midleWares/asyncWrapper.js";
import {
  checkAuthenticity,
  checkAuthenticityAndLogout,
} from "../midleWares/checkAuthenticity.js";
import { makeImagePublic, processImage, uploadImage } from "../midleWares/fileHandler.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  validateBody(registerLoginUserSchema),
  asyncWrapper(createNewUser),
  asyncWrapper(sendVerificationEmail)
);

userRouter.get("/verify/:token", asyncWrapper(verificationTokenCheck));

userRouter.post(
  "/verify",
  validateBody(resendEmailSchema),
  asyncWrapper(sendVerificationEmail)
);

userRouter.post(
  "/login",
  validateBody(registerLoginUserSchema),
  asyncWrapper(loginUser)
);

userRouter.get(
  "/current",
  asyncWrapper(checkAuthenticity),
  getCurrentUserCreds
);

userRouter.put(
  "/update",
  asyncWrapper(checkAuthenticity),
  uploadImage.single("avatar"),
  asyncWrapper(processImage),
  asyncWrapper(makeImagePublic),
  validateBody(changeUserCredsSchema),
  asyncWrapper(chahgeUserCreds)
);

userRouter.get("/refreshtoken");

userRouter.post("/logout", asyncWrapper(checkAuthenticityAndLogout));

export default userRouter;
