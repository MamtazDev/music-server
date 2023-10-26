const User = require("../models/userModel");

exports.getUser = async (req, res) => {
  try {
    const user = req.user; // User is attached to the request in the middleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only the necessary user fields
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Error in getUser:", error.message); // Added context to the log
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
