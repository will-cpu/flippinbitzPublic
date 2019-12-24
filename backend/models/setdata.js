const mongoose = require('mongoose');

const setdataSchema = mongoose.Schema({
  data: { type: [Number] , requited: true},
  search: { type: Number , requited: true},
  answer: { type:  String, requited: true},
});

module.exports = mongoose.model('SetData', setdataSchema);
