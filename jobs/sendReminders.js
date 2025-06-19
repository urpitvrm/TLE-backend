const cron = require("node-cron");
const CodeforcesData = require("../models/codeforcesDataModel");
const sendReminderMail = require("../utils/mailer");

function startReminderJob() {
  cron.schedule("12 22 * * *", async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const minTimestamp = Math.floor(sevenDaysAgo.getTime() / 1000);

    try {
      const inactiveStudents = await CodeforcesData.find({
        autoReminderDisabled: false,
        $or: [
          { submissions: { $size: 0 } },
          {
            submissions: {
              $not: {
                $elemMatch: { creationTimeSeconds: { $gt: minTimestamp } },
              },
            },
          },
        ],
      }).populate("student");

      for (const user of inactiveStudents) {
        if (user.student && user.student.email) {
          await sendReminderMail(user.student.email, user.handle);
          user.reminderCount += 1;
          await user.save();
          console.log(`Reminder sent to: ${user.handle}`);
        }
      }

      console.log("Reminder check completed.");
    } catch (err) {
      console.error("Error sending reminders:", err);
    }
  });
}

module.exports = startReminderJob;
