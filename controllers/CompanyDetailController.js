const company = require('../Model/company');
const companyVisitEmployeesByDayModel = require('../Model/companyVisitEmployeesByDayModel');
const companyVistsMonthRange = require("../Model/companyMonthRange");
const { default: mongoose } = require('mongoose');

async function addCompany(req, res) {
  try {
    var detail = {
      "company_name": req.body.company_name,
      "email": req.body.email,
      "company_address": req.body.company_address,
      "phone_number": req.body.phone_number
    }
    let result = await company.create(detail);
    res.success(result);
  }
  catch (error) {
    res.success([], 404, error.message);
  }
}

async function getCompanyDetail(req, res) {
  try {
    var page_no = req.body.page_no;
    var items = req.body.items;
    var offset = items * page_no - items;
    var details = await company.find({}, ['_id', 'company_name', 'comapny_address', 'email', 'phone_number']).skip(offset).limit(items);
    res.success({ "comapny_details": details });
  }
  catch (error) {

    res.success([], 400, error.message);
  }
}


/**Add Visits Details In Company Visits Table */
async function companyVisitsDetails(req, res) {

  try {

    const companyVistsMonthsRangeRequest = {
      "company_id": req.body.months_range.company_id,
      "from_date": req.body.months_range.from_date,
      "to_date": req.body.months_range.to_date,
      "service_type": req.body.months_range.service_type
    }

    const filters = {
      "company_id": req.body.months_range.company_id,
      "service_type": req.body.months_range.service_type
    }

    const companyMonthRangeDetails = await companyVistsMonthRange.companyMonthRange.findOneAndUpdate(filters, companyVistsMonthsRangeRequest, {
      new: true
    });

    if (!(typeof companyMonthRangeDetails === 'object' && companyMonthRangeDetails !== null && !Array.isArray(companyMonthRangeDetails))) {
      await companyVistsMonthRange.companyMonthRange.create(companyVistsMonthsRangeRequest);
    }

    for (const record of req.body.visits_employees_details) {

      const filters = {
        company_id: record.company_id,
        service_type: record.service_type,
        day: record.day
      }

      const companyVisitDetailsForDay = await companyVisitEmployeesByDayModel.companyVisitEmployeesByDayModel.findOneAndUpdate(filters, record, {
        new: true
      });

      if (!(typeof companyVisitDetailsForDay === 'object' && companyVisitDetailsForDay !== null && !Array.isArray(companyVisitDetailsForDay))) {
        await companyVisitEmployeesByDayModel.companyVisitEmployeesByDayModel.create(record);
      }

    }

    res.success();

  } catch (error) {
    res.success([], 400, error.message);
  }
}

/**
 * ============================================================
 * -------------------EMPLOYEE VISISTS DETAILS-----------------
 * ============================================================
 * */

async function getEmployeeVisitsList(req, res) {

  try {

    var items = req.body.no_of_record;
    var page_no = req.body.page_number;
    var offset = page_no * items - items;

    let filters = {};
    let filtersForEmpVisits = {};
    if (typeof req.body.filters === 'object' && req.body.filters !== null) {
      if (req.body.filters.company_id !== null) {
        filters['company_id'] = mongoose.Types.ObjectId(req.body.filters.company_id);
      }

      if (typeof req.body.filters.day !== 'undefined') {
        filtersForEmpVisits['employee_visits.day'] = req.body.filters.day;
      }
    }

   
    let arg = {
      query: [
        {
          $match: { ...filters}
        },
        {
          $lookup: {
            from: "companyvisitemployeesbydays",
            localField: "company_id",
            foreignField: "company_id",
            as: "employee_visits"
          }
        },
        {
          $unwind: '$employee_visits'
        },
        {
          $match: { ...filtersForEmpVisits}
        },
        {
          $lookup: {
            from: "company_details",
            localField: "company_id",
            foreignField: "_id",
            as: "company_details"
          }
        },
        {
          $unwind: '$company_details'
        },
        {
          $lookup: {
            from: "employees",
            localField: "employee_visits.employee_id",
            foreignField: "_id",
            as: "employee_details"
          }
        },
        {
          $unwind: '$employee_details'
        },
        {
          $addFields:
          {
            from_date: '$employee_visits.from_date',
            to_date: '$employee_visits.to_date',
            company_email: '$company_details.email',
            company_name: '$company_details.company_name',
            company_address: '$company_details.company_address',
            employee_name: { $concat: ['$employee_details.first_name', '$employee_details.last_name'] },
            day: '$employee_visits.day',
          }
        },
       
        { $limit: req.body.no_of_record },
        { $skip: offset },
        {
          $project: {
            from_date: 1,
            to_date: 1,
            company_email: 1,
            company_name: 1,
            company_address: 1,
            employee_name: 1,
            last_name: 1,
            day: 1
          }
        }

      ]
    }


    let employeeVisitsDetails = await companyVistsMonthRange.companyMonthRange.aggregate(arg.query)
    res.success(employeeVisitsDetails);
  } catch (error) {
    res.success([], 400, error.message);
  }
}




module.exports = {
  addCompany: addCompany,
  getCompanyDetail: getCompanyDetail,
  companyVisitsDetails: companyVisitsDetails,
  getEmployeeVisitsList: getEmployeeVisitsList
}