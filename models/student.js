
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  mobile: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  // password: { type: String, required: true, minlength: 6 },
  // codeforcesHandle: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   unique: true,
  //   lowercase: true,
  // },
  codeforcesHandle: {
    type: String,
    required: false,
    unique: true,
  },
  
  cfLastUpdated: {
    type: Date,
    default: null,
  },
  cfSubmissions: {
    type: [Object], 
    default: [],
  },
  cfContests: {
    type: [Object], 
    default: [],
  },
  reminderCount: { type: Number, default: 0 },
  autoReminderDisabled: { type: Boolean, default: false },
});


const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
