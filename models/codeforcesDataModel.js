


const mongoose = require("mongoose");

const codeforcesDataSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true, // Ensures one CF record per student
  },
  mobile: {
    type: String,
    required: true,
    trim: true, // Good to add
  },
  handle: {
    type: String,
    required: true,
    trim: true,
    unique:true,
    lowercase: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: "unrated",
  },
  maxRating: {
    type: Number,
    default: 0,
  },
  maxRank: {
    type: String,
    default: "unrated",
  },
  submissionCount: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  submissions: {
    type: [mongoose.Schema.Types.Mixed], // Better than [Object]
    default: [],
  },
  contests: {
    type: [mongoose.Schema.Types.Mixed], // Better than [Object]
    default: [],
  },
  reminderCount: {
    type: Number,
    default: 0,
  },
  autoReminderDisabled: {
    type: Boolean,
    default: false,
  },
});

const CodeforcesData = mongoose.model("CodeforcesData", codeforcesDataSchema);
module.exports = CodeforcesData;
