
const cron = require("node-cron");
const axios = require("axios");
const Student = require("../models/student");
const CodeforcesData = require("../models/codeforcesDataModel");

let currentTask = null;

function scheduleCodeforcesSync(cronTime) {
  if (currentTask) {
    currentTask.stop(); 
    console.log("Previous cron job stopped.");
  }

  console.log("Codeforces cron job scheduled with:", cronTime);
  currentTask = cron.schedule(cronTime, async () => {
    console.log("Running scheduled Codeforces sync...");

    try {
      const students = await Student.find({ codeforcesHandle: { $ne: null } });
      console.log(`Found ${students.length} students to sync.`);

      for (const student of students) {
        if (!student._id || !student.codeforcesHandle) {
          console.warn(
            "Skipping student due to missing _id or handle:",
            student
          );
          continue;
        }

        await syncStudentCFData(student);
      }
    } catch (err) {
      console.error("Codeforces Sync Error:", err.message);
    }
  });
}


async function syncStudentCFData(student) {
  try {
    const handle = student.codeforcesHandle || "missing_handle";
    let userInfo = {};
    let submissionCount = 0;
    let submissions = [];
    let contests = [];
    let rating = 0;
    let rank = "N/A";
    let maxRating = 0;
    let maxRank = "N/A";

    if (student.codeforcesHandle) {
      try {
        const [userRes, submissionRes, ratingRes] = await Promise.all([
          axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
          axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
          axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
        ]);

        userInfo = userRes.data.result[0];
        submissionCount = submissionRes.data.result.length;
        submissions = submissionRes.data.result;
        contests = ratingRes.data.result;
        rating = userInfo.rating || 0;
        rank = userInfo.rank || "unrated";
        maxRating = userInfo.maxRating || 0;
        maxRank = userInfo.maxRank || "unrated";
      } catch (err) {
        console.warn(`Invalid handle "${handle}":`, err.message);
      }
    }

    await CodeforcesData.findOneAndUpdate(
      { student: student._id },
      {
        student: student._id,
        email: student.email || "N/A",
        mobile: student.mobile || "N/A",
        handle,
        rating,
        rank,
        maxRating,
        maxRank,
        submissionCount,
        submissions,
        contests,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log(
      `Stored Codeforces data for student: ${student.name || handle}`
    );
  } catch (err) {
    console.error(`Error syncing student ${student._id}:`, err.message);
  }
}

async function syncUpdateStudentCFData(student) {
  try {
    // if (!student || !student.codeforcesHandle) return;
    console.log(student.codeforcesHandle);
    const handle = student.codeforcesHandle;
    console.log("h", student)
    const userInfoURL = `https://codeforces.com/api/user.info?handles=${handle}`;
    const submissionsURL = `https://codeforces.com/api/user.status?handle=${handle}`;
    const ratingURL = `https://codeforces.com/api/user.rating?handle=${handle}`;

    const [userRes, submissionRes, ratingRes] = await Promise.all([
      axios.get(userInfoURL),
      axios.get(submissionsURL),
      axios.get(ratingURL),
    ]);

    const userInfo = userRes.data.result[0];
    const submissionCount = submissionRes.data.result.length;
    const contests = ratingRes.data.result;

    await CodeforcesData.findOneAndUpdate(
      { student: student._id },
      {
        student: student._id,
        email:student.email,
        mobile: student.mobile || "N/A",
        handle,
        rating: userInfo.rating || 0,
        rank: userInfo.rank || "unrated",
        maxRating: userInfo.maxRating || 0,
        maxRank: userInfo.maxRank || "unrated",
        submissionCount,
        submissions: submissionRes.data.result,
        contests,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log(`Synced Codeforces data for: ${handle}`);
  } catch (err) {
    console.error(
      `Failed to sync data for student ${student.codeforcesHandle}:`,
      err.message
    );
  }
}

module.exports = {
  scheduleCodeforcesSync,
  syncStudentCFData,
  syncUpdateStudentCFData,
};
