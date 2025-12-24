import ExcelJS from 'exceljs';

export async function exportToExcel(data: any[], filename: string) {
  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add headers from first row keys
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Add data rows
    data.forEach((row) => {
      worksheet.addRow(Object.values(row));
    });
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Create blob and trigger download
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
