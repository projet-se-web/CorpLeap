const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnterpriseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  CUI: {
    type: Number,
    required: true
  },
  createdOn: {
    type: Date,
    required: false
  },
  employees: {
    type: [{
    type: Number
  }],
    required: true
  }
});
module.exports = Enterprise = mongoose.model('enterprises', EnterpriseSchema);