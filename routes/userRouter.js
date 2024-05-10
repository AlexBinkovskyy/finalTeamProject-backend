import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  registerLoginUserSchema,
  resendEmailSchema,
} from "../models/validationSchemas/userValidationSchema.js";
import {
  createNewUser,
  loginUser,
  sendVerificationEmail,
  verificationTokenCheck,
} from "../controllers/userController.js";
import { asyncWrapper } from "../midleWares/asyncWrapper.js";

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

userRouter.get("/current");

userRouter.put("/:userId");

userRouter.get("/refreshtoken");

userRouter.post("/logout/:userId");

export default userRouter;
