import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  registerLoginUserSchema,
  resendEmailSchema,
} from "../models/validationSchemas/userValidationSchema.js";
import {
  createNewUser,
  getCurrentUserCreds,
  loginUser,
  sendVerificationEmail,
  verificationTokenCheck,
} from "../controllers/userController.js";
import { asyncWrapper } from "../midleWares/asyncWrapper.js";
import { checkAuthenticity, checkAuthenticityAndLogout } from "../midleWares/checkAuthenticity.js";

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

userRouter.post("/login", validateBody(registerLoginUserSchema), asyncWrapper(loginUser));

userRouter.get("/current", asyncWrapper(checkAuthenticity), getCurrentUserCreds);

userRouter.put("/:userId");

userRouter.get("/refreshtoken");

userRouter.post("/logout", asyncWrapper(checkAuthenticityAndLogout));

export default userRouter;
