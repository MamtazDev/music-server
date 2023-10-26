const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const YOUR_BCRYPT_SALT_ROUNDS = parseInt(
  process.env.YOUR_BCRYPT_SALT_ROUNDS,
  10
);

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        type: "email",
        message: "Email Already in use!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, YOUR_BCRYPT_SALT_ROUNDS);
    const user = new User({ email, password: hashedPassword });
    const savedUser = await user.save();

    // Generate JWT token
    const expiryDate = Math.floor(Date.now() / 1000) + 60 * 60 * 72; // Expires in 3 days
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: expiryDate,
    });
    const refreshToken = jwt.sign({ id: savedUser._id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      auth: {
        token,
        refreshToken,
      },
      user: {
        id: savedUser._id,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error(
      "Error during registration. Exiting register function.",
      error
    );
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const getUser = async (req, res) => {
  console.log("Entering getUser function");
  try {
    if (!req.user) {
      console.log("req.user is undefined. Exiting getUser function.");
      return res.status(401).json({ message: "User not authenticated" });
    }
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      console.log("User not found. Exiting getUser function.");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User fetched successfully. Exiting getUser function.");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user. Exiting getUser function.", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Email or password missing. Exiting login function.");
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email/Password" });
    }
    const expiryDate = Math.floor(Date.now() / 1000) + 60 * 60 * 72;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: expiryDate,
    });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      auth: {
        token,
        refreshToken,
      },
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login. Exiting login function.", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const refresh = async (req, res) => {
  console.log("Entering refresh function");
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    console.log("No refresh token provided. Exiting refresh function.");
    return res
      .status(401)
      .json({ message: "No refresh token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, JWT_SECRET, {
      expiresIn: "72h",
    });
    console.log(
      "Refresh token verified and new token generated. Exiting refresh function."
    );
    res.status(200).json({ token: newToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("Refresh token expired. Exiting refresh function.");
      return res
        .status(401)
        .json({ message: "Refresh token expired, please log in again" });
    } else {
      console.error(
        "Error during token refresh. Exiting refresh function.",
        error
      );
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const isExist = await User.findOne({ _id: req.params.id });
    console.log(isExist);
    if (isExist) {
      const result = await User.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({
        status: true,
        message: "Image Update successfully",
        data: result,
      });
    } else {
      res.status(201).json({
        status: true,
        message: "Image update unsuccessful",
      });
    }
  } catch (error) {
    res.status(201).json({
      status: false,
      message: "Image update unsuccessful",
    });
  }
};

module.exports = { register, login, getUser, refresh, updateUser };
