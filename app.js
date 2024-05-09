import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import express from "express";

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
