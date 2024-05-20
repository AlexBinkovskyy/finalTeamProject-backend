import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from "./swagger.json" assert { type: "json" };
import userRouter from "./routes/userRouter.js";
import waterRouter from "./routes/waterRouter.js";


dotenv.config();
const { PORT, DB_HOST } = process.env;

const app = express();

mongoose.set("strictQuery", true);
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log("DataBase is connected successfuly");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", userRouter);
app.use("/api/water", waterRouter);
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_, res) => {
  res.status(404).json({ message: "Rout not found" });
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Server error!!!" } = error;
  res.status(status).json({ message });
});
