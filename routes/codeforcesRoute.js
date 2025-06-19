

const express = require("express");
const router = express.Router();
const CodeforcesData = require("../models/codeforcesDataModel");
const { findByIdAndUpdate } = require("../models/cronTime");


router.get("/codeforces-data", async (req, res) => {
  const { studentId } = req.query;

  try {
    const filter = studentId ? { student: studentId } : {};
    const rawData = await CodeforcesData.find(filter).populate(
      "student",
      "name email mobile codeforcesHandle"
    );

    
    const data = rawData.filter((entry) => entry.student);

    res.json(data);
  } catch (error) {
    console.error("Error fetching Codeforces data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/toggle/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const current = await CodeforcesData.findById(id);
    if (!current) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const updated = await CodeforcesData.findByIdAndUpdate(
      id,
      { autoReminderDisabled: !current.autoReminderDisabled },
      { new: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
});



module.exports = router;

