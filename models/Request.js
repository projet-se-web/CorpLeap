const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: false
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false
  },
  addedOn: {
    type: Number,
    default: new Date().getTime()
  }
});
module.exports = Request = mongoose.model("requests", RequestSchema);
