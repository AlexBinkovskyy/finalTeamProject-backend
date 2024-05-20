import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  changeUserCredsSchema,
  emailSendPassRecoverySchema,
  passrecoverySchema,
  refreshTokenSchema,
  registerLoginUserSchema,
  resendEmailSchema,
} from "../models/validationSchemas/userValidationSchema.js";
import {
  chahgeUserCreds,
  createNewUser,
  emailPassRecoveryController,
  getAllUsers,
  getCurrentUserCreds,
  loginUser,
  recoveryPasswordController,
  refreshPairToken,
  sendVerificationEmail,
  verificationTokenCheck,
} from "../controllers/userController.js";
import { asyncWrapper } from "../midleWares/asyncWrapper.js";
import {
  checkAuthenticity,
  checkAuthenticityAndLogout,
  checkRefreshAuthenticity,
} from "../midleWares/checkAuthenticity.js";
import {
  makeImagePublic,
  processImage,
  uploadImage,
} from "../midleWares/fileHandler.js";

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

userRouter.post("/logout", asyncWrapper(checkAuthenticityAndLogout));

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

userRouter.post(
  "/passrecovery",
  validateBody(emailSendPassRecoverySchema),
  asyncWrapper(emailPassRecoveryController)
);

userRouter.patch(
  "/passrecovery",
  validateBody(passrecoverySchema),
  asyncWrapper(recoveryPasswordController)
);

userRouter.post(
  "/refreshtoken",
  // validateBody(refreshTokenSchema),
  asyncWrapper(checkRefreshAuthenticity),
  asyncWrapper(refreshPairToken)
);

userRouter.get("/getusers", getAllUsers);

export default userRouter;
