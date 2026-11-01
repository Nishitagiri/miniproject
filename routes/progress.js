
const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Save or update student progress
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress === undefined || progress === null || typeof progress !== "object" || Array.isArray(progress)) {
      return res.status(400).json({
        message: "Valid progress data is required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { progress } },
      { new: true, runValidators: true }
    ).select("username email progress");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Progress saved successfully",
      progress: user.progress
    });
  } catch (error) {
    console.error("Save progress error:", error.message);
    res.status(500).json({
      message: "Could not save progress"
    });
  }
});

// Get logged-in student's progress
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("progress");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      progress: user.progress
    });
  } catch (error) {
    console.error("Get progress error:", error.message);
    res.status(500).json({
      message: "Could not retrieve progress"
    });
  }
});

module.exports = router;
