const mongoose = require('mongoose');

const { companyVisitEmployeesByDay } = require('../schemas/companyVisitEmployeesByDay.schema');

const companyVisitEmployeesByDayModel = mongoose.model('CompanyVisitEmployeesByDay', companyVisitEmployeesByDay);

module.exports = {
    companyVisitEmployeesByDayModel: companyVisitEmployeesByDayModel
}