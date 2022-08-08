const xl = require('excel4node');
const fs = require('fs');

async function arrayToExcel(req, res) {

    var fileName = Date.now() + "output.xlsx";

    //    console.log(req.employeeDetails);
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    
    console.log(req.employeeDetails[0]);
    const headingColumnNames = Object.keys(req.employeeDetails[0].toJSON());
    //Write Column Title in Excel file
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });
    //Write Data in Excel file
    let rowIndex = 2;
    
    req.employeeDetails.forEach(record => {
        let columnIndex = 1;
        Object.keys(record.toJSON()).forEach(columnName => {
            ws.cell(rowIndex, columnIndex++)
                .string(record[columnName].toString())
        });
        rowIndex++;
    });

    wb.write(fileName, function (err, stats) {
        if (err) {
            console.error(err);
        } else {
            res.download(fileName, err => {
                if (err) {
                    fs.unlinkSync(fileName);
                    res.send("unable to download the excel file")
                }
                fs.unlinkSync(fileName);
            })
            // Prints out an instance of a node.js fs.Stats object
        }
    });



}

module.exports = {
    arrayToExcel: arrayToExcel
}