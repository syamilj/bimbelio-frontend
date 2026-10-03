// Ekspor tabel ke Excel/CSV di browser. exceljs dimuat hanya saat dipakai.

type Row = Record<string, unknown>;

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const toCell = (value: unknown) =>
  value === null || value === undefined
    ? ''
    : value instanceof Date
      ? value
      : typeof value === 'object'
        ? JSON.stringify(value)
        : (value as string | number | boolean);

async function buildWorkbook(
  rows: Row[],
  sheetName: string,
  widths?: number[],
) {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  if (rows.length > 0) {
    const headers = Object.keys(rows[0]);
    sheet.addRow(headers);
    for (const row of rows) sheet.addRow(headers.map((h) => toCell(row[h])));
    if (widths) sheet.columns = widths.map((width) => ({ width }));
  }
  return workbook;
}

export async function exportXlsx(
  rows: Row[],
  fileName: string,
  options: { sheetName?: string; widths?: number[] } = {},
) {
  const workbook = await buildWorkbook(
    rows,
    options.sheetName ?? 'items',
    options.widths,
  );
  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    `${fileName}.xlsx`,
  );
}

export async function exportCsv(rows: Row[], fileName: string) {
  const workbook = await buildWorkbook(rows, 'items');
  const buffer = await workbook.csv.writeBuffer();
  downloadBlob(
    new Blob([buffer], { type: 'text/csv;charset=utf-8;' }),
    `${fileName}.csv`,
  );
}

export function downloadText(
  text: string,
  fileName: string,
  type = 'text/plain',
) {
  downloadBlob(new Blob([text], { type: `${type};charset=utf-8` }), fileName);
}
