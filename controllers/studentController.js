const Student = require("../models/student");
const { Parser } = require("json2csv");
const {
  syncStudentCFData,
  syncUpdateStudentCFData,
} = require("../cron/scheduleCodeforcesSync");
const CodeforcesData = require("../models/codeforcesDataModel");

const getStudentById = async (req, res) => {
  const studentId = req.params.id;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const registerStudent = async (req, res) => {
  const { name, email, mobile, codeforcesHandle } = req.body;

  try {
    const newStudent = new Student({
      name,
      email,
      // password,
      mobile,
      codeforcesHandle,
    });

    await newStudent.save();

    
    if (codeforcesHandle) {
      await syncStudentCFData(newStudent);
    }

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    // console.log("error:: ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  try {
    const student = await Student.findByIdAndDelete(studentId);
    // const studentFromCf = await CodeforcesData.findByIdAndDelete()
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const { name, email, mobile, codeforcesHandle } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { name, email, mobile, codeforcesHandle },
      { new: true }
    );
    console.log("u"  ,updatedStudent)
    if (codeforcesHandle) {
      await syncUpdateStudentCFData(updatedStudent);
    }
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully", updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
const exportStudentsToCSV = async (req, res) => {
  try {
    const students = await Student.find().lean();

    const data = await Promise.all(
      students.map(async (student) => {
        const cfData = await CodeforcesData.findOne({
          student: student._id,
        }).lean();
        return {
          name: student.name,
          email: student.email,
          mobile: student.mobile,
          codeforcesHandle: student.codeforcesHandle || "N/A",
          currentRating: cfData?.rating || "N/A",
          maxRating: cfData?.maxRating || "N/A",
        };
      })
    );

    const fields = [
      "name",
      "email",
      "mobile",
      "codeforcesHandle",
      "currentRating",
      "maxRating",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("students.csv");
    res.send(csv);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating CSV", error: error.message });
  }
};



module.exports = {
  getStudentById,
  getAllStudents,
  registerStudent,
  deleteStudent,
  updateStudent,
  exportStudentsToCSV,
  
};