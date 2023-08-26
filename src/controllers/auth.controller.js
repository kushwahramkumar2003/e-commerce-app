//signup a new user

import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";
import User from "../models/user.schema.js";
import mailHelper from "../utils/mailHelper";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/*********************************************
 *
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
 *
 *********************************************/

export const signUp = asyncHandler(async (req, res) => {
  //get data from user
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    throw new CustomError("Please add all fields.", 400);
  }
  //lets add this data to database

  //check if user already exists
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const user = await User.create({
    name: name,
    email,
    email,
    password,
  });

  const token = user.getJWTtoken();

  //safety
  user.password = undefined;

  // store this token in user's cookie
  res.cookie("token", token, cookieOptions);

  //   send back is response to user
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || password) {
    throw new CustomError("Please fill all details", 4000);
  }
  const user = User.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError("Invalid credentials", 4000);
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (isPasswordMatched) {
    const token = user.getJWTtoken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
    throw new CustomError("Password is incorrect", 400);
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;
  if (!user) {
    throw new CustomError("User not found", 401);
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError("Please provide email", 400);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  const resetToken = user.generateForgotPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/password/reset/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  try {
    await mailHelper({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({
      success: true,
      message: "Email sent",
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new CustomError("Email could not be sent", 500);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;
  if (!resetToken || !password || !confirmPassword) {
    throw new CustomError("Please provide token and password", 400);
  }
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomError("Invalid token or expired", 400);
  }
  if (password !== confirmPassword) {
    throw new CustomError("Password does not match", 400);
  }
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  // optional
  const token = user.getJWTtoken();
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

