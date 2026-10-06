const ExcelJS = require('exceljs');
async function run() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('./contohExcel/BA 2022.xlsx');
  const worksheet = workbook.worksheets[0];
  const data = [];
  let cols = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      cols = row.values.slice(1);
    } else {
      let obj = {};
      row.values.slice(1).forEach((val, i) => {
        if (val && typeof val === 'object' && val.text) obj[cols[i]] = val.text;
        else if (val && typeof val === 'object' && val.result !== undefined) obj[cols[i]] = val.result;
        else obj[cols[i]] = val;
      });
      data.push(obj);
    }
  });
  console.log(JSON.stringify(data, null, 2));
}
run().catch(console.error);
