const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  dob: {
    type: Date,
    max: new Date(),
  },
  country: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: String,
    trim: true,
  },
  phoneCode: {
    type: String,
    trim: true,
  },
  telNumber: {
    type: String,
    trim: true,
    match: /^\+?[1-9]\d{1,14}$/,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Non-binary", "Not disclosed"],
    default: "Not disclosed",
  },
  isMusician: {
    type: Boolean,
    default: false,
  },
  //Social media links
  isYouTubeEnabled: {
    type: Boolean,
    default: false,
  },
  isSpotifyEnabled: {
    type: Boolean,
    default: false,
  },
  isAppleMusicEnabled: {
    type: Boolean,
    default: false,
  },
});

userSchema.virtual("fullName").get(function () {
  return `${
    this.firstName
  } ${this.middleName ? this.middleName + " " : ""}${this.lastName}`;
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
