import jwt from "jsonwebtoken";
import ApiError from "../classes/ApiError.js";
import User from "../models/users.js";
import {
  sendConfirmationEmail,
  sendResetPasswordEmail,
} from "../services/emails.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (username == undefined || email == undefined || password == undefined) {
      throw ApiError.BadRequest("Please provide all the information required");
    }

    let user = await User.findOne({ email });
    if (user) {
      throw ApiError.BadRequest("A user with this email already exist");
    }

    user = await User.create({ ...req.body, links: [] });

    sendConfirmationEmail({ userId: user._id, username, email });

    res.status(201).json({ message: "Account has been created!" });
  } catch (e) {
    next(e);
  }
};

export const confirmAccount = async (req, res, next) => {
  try {
    const { token, id } = req.params;
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (payload == undefined || payload == null || payload.user.userId !== id) {
      throw ApiError.Unauthorized("You are unauthorized for this action");
    }

    await User.findByIdAndUpdate(id, { isConfirmed: true });
    // res.redirect(`${process.env.CLIENT_URL}/auth/login`)
    res.status(204).json({ message: "your account is confirmed" });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    if (req.body.email == undefined || req.body.password == undefined) {
      throw ApiError.BadRequest("Please Provide all the required fields");
    }

    const user = await User.findOne({ email: req.body.email });

    if (user == null || user == undefined) {
      throw ApiError.BadRequest("Invalid email");
    }

    if (!user.isConfirmed) {
      throw ApiError.Unauthorized(
        "Please confirm your account first in order to access your profile"
      );
    }

    const passwordCorrect = await user.comparePassword(req.body.password);

    if (!passwordCorrect) {
      throw ApiError.BadRequest("Invalid password");
    }

    const accessToken = user.genToken(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        links: user.links,
      },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXP
    );
    const refreshToken = user.genToken(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        links: user.links,
      },
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXP
    );

    // res.redirect(`${process.env.CLIENT_URL}/`)
    res.status(200).json({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (user == null || user == undefined) {
      throw ApiError.NotFound("User not found");
    }

    if (req.body == undefined) {
      throw ApiError.BadRequest("please provide the required fields");
    }

    if (
      req.body.password == undefined ||
      req.body.confirmPassword == undefined
    ) {
      throw ApiError.BadRequest("please provide the required fields");
    }

    if (req.body.password !== req.body.confirmPassword) {
      throw ApiError.BadRequest("passwords don't match");
    }

    const hashedPassword = await user.hashPassword(req.body.password);

    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });

    // res.redirect(`${process.env.CLIENT_URL}/auth/login`)
    res.status(200).json({ message: "password changed" });
  } catch (e) {
    next(e);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    if (req.body.email == undefined || req.body.email == null) {
      throw ApiError.BadRequest("please provide the email");
    }

    const user = await User.findOne({ email: req.body.email });
    if (user == null || user == undefined) {
      throw ApiError.NotFound("there is no user with this email");
    }

    sendResetPasswordEmail({
      userId: user._id,
      username: user.username,
      email: user.email,
    });

    res.status(200).json({ message: "an email has been sent to you" });
  } catch (e) {
    next(e);
  }
};

export const resetPasswordGET = async (req, res, next) => {
  try {
    const { token, id } = req.params;

    if (token == undefined || token == null || id == undefined || id == null) {
      throw ApiError.BadRequest("Please click on the link sent to your email");
    }

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (payload.user.userId !== id || payload == undefined || payload == null) {
      throw ApiError.Unauthorized("You are not authorized");
    }

    // res.redirect(`${process.env.CLIENT_URL}/auth/reset-password`)
    res
      .status(200)
      .json({ message: "you're being redirected to reset password page..." });
  } catch (e) {
    next(e);
  }
};

export const resetPasswordPOST = async (req, res, next) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const { id, token } = req.params;
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (newPassword == undefined || confirmNewPassword == undefined) {
      throw ApiError.BadRequest("Please provide all the required fields");
    }

    if (newPassword !== confirmNewPassword) {
      throw ApiError.BadRequest("Passwords do not match");
    }

    if (payload == null || payload == undefined || payload.user.userId !== id) {
      throw ApiError.BadRequest("Invalid token");
    }
    const user = await User.findById(id);
    if (!user) {
      throw ApiError.NotFound("User not found");
    }

    const hashedPassword = await user.hashPassword(newPassword);

    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.status(200).json({ message: "Password updated" });
  } catch (e) {
    next(e);
  }
};

export const genAccessToken = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.body;
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (payload == undefined || payload == null) {
      throw ApiError.Unauthorized("invalid refresh token");
    }

    const { userId } = payload;
    const user = await User.findById(userId);
    if (user == null || user == undefined) {
      throw ApiError.NotFound("User not found");
    }
    const newAccessToken = user.genToken(
      { ...payload },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXP
    );

    res.status(201).json({ newAccessToken });
  } catch (e) {
    next(e);
  }
};
