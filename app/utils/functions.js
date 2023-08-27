const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { UserModel } = require("../models/users.model");
const {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} = require("./constants");
const createError = require("http-errors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function signAccessToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userId);
    const payload = { userID: userId };
    const options = { expiresIn: "1d" };
    JWT.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
      if (err) reject(createError.InternalServerError("Server error ⚠️"));
      resolve(token);
    });
  });
}

function signRefreshToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userId);
    const payload = { userID: userId };
    const options = { expiresIn: "1y" };
    JWT.sign(payload, REFRESH_TOKEN_SECRET_KEY, options, (err, token) => {
      if (err) reject(createError.InternalServerError("Server error ⚠️"));
      resolve(token);
    });
  });
}

function verifyRefreshToken(token) {
  try {
    JWT.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
      return new Promise(async (resolve, reject) => {
        if (err) reject(createError.Unauthorized("Log in to your account."));
        const { userID } = payload || {};
        const user = await UserModel.findById({ _id: userID });
        if (!user) reject(createError.NotFound("User not found."));
        resolve(userID);
      });
    });
  } catch (error) {
    next(error);
  }
}

function deleteInvalidPropertiesOfObject(data = {}, blacklist = []) {
  let nullishData = ["", " ", null, 0, "0", undefined];
  Object.keys(data).forEach((key) => {
    if (nullishData.includes(data[key])) delete data[key];
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (blacklist.includes(data[key])) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
  });
}

function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}

function deleteFileInPublic(fileAddress) {
  if (fileAddress) {
    const filePath = fileAddress;
    console.log(filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

function deleteFolderInPublic(dir) {
  if (dir) {
    const folderPath = path
      .join(__dirname, "..", "..", "public", "uploads", dir)
      .replace(/\\/g, "/");
    if (fs.existsSync(folderPath))
      fs.rmSync(folderPath, { recursive: true, force: true });
  }
}

async function followUser(originUser, targetUserID) {
  const addToFollowingsResult = await UserModel.updateOne(
    { _id: originUser._id },
    { $push: { followings: targetUserID } }
  );
  const addToFollowersResult = await UserModel.updateOne(
    { _id: targetUserID },
    { $addToSet: { followers: originUser._id } }
  );
  if (addToFollowingsResult.modifiedCount && addToFollowersResult.modifiedCount)
    return true;
}

function randomNumberGenerator() {
  return Math.floor(Math.random() * 90000 + 10000);
}

function sendEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_HOST_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_HOST_USERNAME,
        pass: process.env.EMAIL_HOST_PASS,
      },
      tls: {
        rejectUnauthorized: false, //Passing through SSL error
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject(error);
      resolve(info);
    });
  });
}

module.exports = {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  deleteInvalidPropertiesOfObject,
  copyObject,
  deleteFileInPublic,
  deleteFolderInPublic,
  followUser,
  randomNumberGenerator,
  sendEmail,
};
