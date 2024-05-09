import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema } from "../models/validationSchemas/userValidationSchema.js";
import {
  createNewUser,
  sendVerificationEmail,
  verificationTokenCheck,
} from "../controllers/userController.js";
import { asyncWrapper } from "../midleWares/asyncWrapper.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  validateBody(registerUserSchema),
  asyncWrapper(createNewUser),
  asyncWrapper(sendVerificationEmail)
);
userRouter.get("/verify/:token",
asyncWrapper(verificationTokenCheck));
userRouter.post("/login");
userRouter.get("/current");
userRouter.put("/:userId");
userRouter.get("/refreshtoken");
userRouter.post("/logout/:userId");

export default userRouter;
