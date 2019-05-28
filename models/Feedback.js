const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: false
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false
  },
  content: {
    questionaire: {
      type: [
        {
          question: String,
          answers: [{ text: String, selected: Boolean, _id: false }],
          _id: false
        }
      ],
      _id: false
    },
    note: {
      question: String,
      answer: String
    }
  },
  addedOn: {
    type: Number,
    default: new Date().getTime()
  }
});
module.exports = Feedback = mongoose.model("feedbacks", FeedbackSchema);
