const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true
  },
  module: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  addedOn: {
    type: Number,
    default: new Date().getTime()
  }
});
module.exports = Request = mongoose.model("requests", RequestSchema);
