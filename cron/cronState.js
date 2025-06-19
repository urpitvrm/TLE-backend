

let currentCronJob = null;

const getCurrentJob = () => currentCronJob;

const setCurrentJob = (job) => {
  currentCronJob = job;
};

module.exports = {
  getCurrentJob,
  setCurrentJob,
};
