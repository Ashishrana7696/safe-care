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

  let filters = {};

  if (typeof req.body.filters === 'object' && req.body.filters !== null) {
    if (req.body.filters.company_id !== null) {
      filters['company_id'] = mongoose.Types.ObjectId(req.body.filters.company_id);
    }
  }


  let arg = {
    query: [
      {
        $match: { ...filters }
      },
      {
        $lookup: {
          from: "companyvisitemployeesbydays",
          localField: "company_id",
          foreignField: "company_id",
          as: "employee_visits"
        }
      },
      // { $unwind: "$employee_visits" },
      {
        $lookup: {
          from: "company_details",
          localField: "_id",
          foreignField: "company_id",
          as: "company_details"
        }
      },
      // { $unwind: "$company_details" },
      
    ]
  }


  let employeeVisitsDetails = await companyVistsMonthRange.companyMonthRange.aggregate(arg.query)
console.log(arg);
  // [{
  //   $lookup: {
  //     from: "companyvisitemployeesbydays",
  //     localField: "service_type",
  //     foreignField: "service_type",
  //     as: "employee_visits"
  //   }
  // }]

  res.success(employeeVisitsDetails);
}




module.exports = {
  addCompany: addCompany,
  getCompanyDetail: getCompanyDetail,
  companyVisitsDetails: companyVisitsDetails,
  getEmployeeVisitsList: getEmployeeVisitsList
}