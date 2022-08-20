const mongoose = require('mongoose');

const attendanceSchema = require('../schemas/attendanceOpertaion.schema');

const attendanceModel = mongoose.model('attendance', attendanceSchema);

module.exports = { attendanceModel: attendanceModel };