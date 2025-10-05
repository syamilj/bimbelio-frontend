export function formatDateRange(
  date1: string | Date | undefined,
  date2: string | Date | undefined,
): string {
  if (!date1 || !date2) {
    return '-';
  }
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // daftar nama bulan Indonesia
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const day1 = d1.getDate();
  const month1 = months[d1.getMonth()];
  const year1 = d1.getFullYear();

  const day2 = d2.getDate();
  const month2 = months[d2.getMonth()];
  const year2 = d2.getFullYear();

  if (year1 === year2) {
    if (d1.getMonth() === d2.getMonth()) {
      return `${day1} - ${day2} ${month1} ${year1}`;
    } else {
      return `${day1} ${month1} - ${day2} ${month2} ${year1}`;
    }
  } else {
    return `${day1} ${month1} ${year1} - ${day2} ${month2} ${year2}`;
  }
}
