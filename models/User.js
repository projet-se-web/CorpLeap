const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// var CourseSchema = mongoose.model('courses').schema;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: false
  },
  lastname: {
    type: String,
    required: false
  },
  fullname: String,
  email: {
    type: String,
    required: false
  },
  birthday: {
    type: Number,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  enterprise: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "enterprises"
    },
    required: false
  },
  type: {
    type: String,
    required: true
  },
  addedOn: {
    type: Number,
    default: new Date().getTime()
  },
  activeCourses: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses"
      }
    ],
    required: false
  },
  pendingCourses: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses"
      }
    ],
    required: false
  },
  completedCourses: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses"
      }
    ],
    required: false
  },
  points: {
    type: Number,
    default: 0
  }
  // requests: {
  //   type: [requestSchema],
  //   required: false
  // }
});
module.exports = User = mongoose.model("users", UserSchema);
