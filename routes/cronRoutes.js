// routes/cronRoutes.js
const express = require("express");
const router = express.Router();
let currentCronJob = null;

const {updateCronController}=require("../controllers/cronController")


router.put("/update-cron",updateCronController );

module.exports = router;
