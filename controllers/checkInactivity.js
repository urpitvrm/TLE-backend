const Student = require("../models/student");
const sendReminderMail = require("../utils/mailer");

const checkInactiveStudents = async () => {
  const students = await Student.find({
    codeforcesHandle: { $ne: null },
    autoReminderDisabled: false,
  });

  const now = new Date();

  for (const student of students) {
    if (!student.cfSubmissions?.length) continue;

    const isActive = student.cfSubmissions.some((sub) => {
      const subTime = new Date(sub.creationTimeSeconds * 1000);
      return (now - subTime) / (1000 * 60 * 60 * 24) <= 7;
    });

    if (!isActive) {
      await sendReminderMail(student.email, student.name);
      student.reminderCount += 1;
      await student.save();
      console.log(`Reminder sent to ${student.name}`);
    }
  }
};

module.exports = checkInactiveStudents;
