


const express = require("express");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const codeforcesRoute = require("./routes/codeforcesRoute");
const cronRoutes = require("./routes/cronRoutes");

const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

const { scheduleCodeforcesSync } = require("./cron/scheduleCodeforcesSync");
const { getCronTime } = require("./helper/getCronTime");
const { setCurrentJob } = require("./cron/cronState");

// Import reminder cron job
const startReminderJob = require("./jobs/sendReminders");

// Enable middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api", codeforcesRoute);
app.use("/api/cron", cronRoutes);

// Connect to DB and start server
connectDB().then(async () => {
  const time = await getCronTime(); 
  console.log("Starting Codeforces sync with:", time || "default time");

  const cronJob = scheduleCodeforcesSync(time || "* 0 2 * * *"); 
  setCurrentJob(cronJob); // Store reference for updates

  // Start the reminder email job
  startReminderJob();

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
