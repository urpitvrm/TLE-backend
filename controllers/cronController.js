


const Cron = require("../models/cronTime");
const { scheduleCodeforcesSync } = require("../cron/scheduleCodeforcesSync");
const { getCurrentJob, setCurrentJob } = require("../cron/cronState");

const updateCronController = async (req, res) => {
  try {
    const { cronTime } = req.body;

    //  Update in DB
    const updated = await Cron.findOneAndUpdate(
      {},
      { crontime: cronTime },
      { new: true, upsert: true }
    );

    //  Stop existing running job
    const existingJob = getCurrentJob();
    if (existingJob) {
      existingJob.stop();
    }

    // Start new cron job
    const newJob = scheduleCodeforcesSync(cronTime);
    setCurrentJob(newJob);

    return res.status(200).json({
      success: true,
      message: "Cron time updated and job rescheduled",
      crontime: updated.crontime,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cron time",
      error: error.message,
    });
  }
};

module.exports = { updateCronController };
