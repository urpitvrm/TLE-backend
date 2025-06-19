const express = require("express");
const { Router } = express;
const Student = require("../models/student.js");

const {
  getAllStudents,
  getStudentById,
  registerStudent,
  deleteStudent,
  updateStudent,
  exportStudentsToCSV,
  toggleReminderController,
} = require("../controllers/studentController.js");

const router = Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/register", registerStudent);
router.delete("/:id", deleteStudent);
router.put("/:id",updateStudent);



router.get("/export/csv", exportStudentsToCSV);

// router.put("/students/:id/toggle-reminder", toggleReminderController);


module.exports = router;
