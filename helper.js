const xl = require('excel4node');
const fs =require('fs');

async function arrayToExcel(req,res) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    const data = [
        {
            "name": "Shadab Shaikh",
            "email": "shadab@gmail.com",
            "mobile": "1234567890"
        },
        {
            "name": "Shadab Shaikh",
            "email": "shadab@gmail.com",
            "mobile": "1234567890"
        },
        {
            "name": "Shadab Shaikh",
            "email": "shadab@gmail.com",
            "mobile": "1234567890"
        }
    ]
    const headingColumnNames = [
        "Name",
        "Email",
        "Mobile",
    ]
    //Write Column Title in Excel file
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });
    //Write Data in Excel file
    let rowIndex = 2;
    data.forEach(record => {
        let columnIndex = 1;
        Object.keys(record).forEach(columnName => {
            ws.cell(rowIndex, columnIndex++)
                .string(record[columnName])
        });
        rowIndex++;
    });
    wb.write('data.xlsx');

    fileName= 'data.xlsx'
    res.download(fileName, err => {
        if (err) {
            console.log(err);
            fs.unlinkSync(fileName);
            res.send("unable to download the excel file")
        }
        fs.unlinkSync(fileName);
    })

}

module.exports = {
    arrayToExcel:arrayToExcel
}