const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number,
    required: true
  },
  content: {
    type: {
      files: [{
        type: Array
      }],
      videos: [{
        type: Array
      }],
      audio: [{
        type: Array
      }]
    },
    required: false
  }
});

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  modules: {
    type: {
      module1: ModuleSchema,
      module2: ModuleSchema,
      module3: ModuleSchema
    },
    required: false
  },
  report: {
    type: String,
    required: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false
  },
  addedOn: {
    type: Date,
    default: new Date().getTime()
  }
  // feedback
});
module.exports = Course = mongoose.model('courses', CourseSchema);