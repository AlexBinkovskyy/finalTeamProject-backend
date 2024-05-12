import multer from "multer";
import path from "node:path";
import HttpErrors from "../helpers/HttpError.js";

const tempDirectory = path.resolve("temp");

const multerConfig = multer.diskStorage({
  destination: tempDirectory,
  filename: (req, file, cb) => {
    console.log("1", JSON.parse(req.body.email).email);
    console.log("2", file);
    cb(null, file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(HttpErrors(400, "Uploaded data must be an image"), false);
  }
};

export const uploadImage = multer({
    storage: multerConfig,
    fileFilter: filter,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  });