import express from 'express'

const userRouter = express.Router();

userRouter.post("/register")
userRouter.post("/login")
userRouter.get("/current")
userRouter.put("/:userId")
userRouter.get("/refreshtoken")
userRouter.post("/logout/:userId")

export default userRouter