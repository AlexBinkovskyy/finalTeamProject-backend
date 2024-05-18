import multer from "multer";
import HttpError from "../helpers/HttpError.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs/promises";

const tempDirectory = path.resolve("temp");
const multerConfig = multer.diskStorage({
  destination: tempDirectory,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(HttpError(400, "Uploaded data must be an image"), false);
  }
};

export const uploadImage = multer({
  storage: multerConfig,
  fileFilter: filter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const processImage = async (req, res, next) => {
  if (req.file === undefined)return next();
  req.file.filename = `userID_${req.user._id}_${req.file.fieldname}`;
  next();
};

export const makeImagePublic = async (req, res, next) => {
  if (req.file === undefined)return next();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  req.user.avatarUrl = await cloudinary.uploader
    .upload(req.file.path, { public_id: req.file.filename })
    .then((res) =>
      cloudinary.url(res.public_id, {
        fetch_format: "auto",
        quality: "auto",
        crop: "fill",
        gravity: "faces:auto",
        // width: 100,
        // height: 100,
        radius: "max",
        effect: "sharpen:100",
      })
    )
    .catch((error) => {
      next(error);
    });
  fs.unlink(path.join(tempDirectory, req.file.originalname));
  next();
};
