
const Cron = require("../models/cronTime");

async function getCronTime() {
  try {
    const cronDoc = await Cron.findOne();
    return cronDoc ? cronDoc.crontime : null;
  } catch (error) {
    console.error("Error fetching cron time:", error);
    return null;
  }
}

module.exports = {
  getCronTime,
};
