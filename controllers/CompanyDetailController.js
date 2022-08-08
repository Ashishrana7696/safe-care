const company = require('../Model/company');

async function addCompany(req,res){
    try{
        var detail={
            "company_name":req.body.company_name,
            "email":req.body.email,
            "company_address":req.body.company_address,
            "phone_number":req.body.phone_number
        }
        let result= await company.create(detail);
        res.success(result);
    }
    catch(error){
        res.success([],404,error.message);
    }
}

async function getCompanyDetail(req,res){
  try{
    var page_no=req.body.page_no;
    var items=req.body.items;
    var offset=items*page_no-items;
    var details=await company.find({},['_id','company_name','comapny_address','email','phone_number']).skip(offset).limit(items); 
    res.success({"comapny_details":details});
  }
  catch(error){

    res.success([],400,error.message);
  }
}

module.exports={
    addCompany:addCompany,
    getCompanyDetail:getCompanyDetail
}