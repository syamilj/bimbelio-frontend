import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const TEST_SECTIONS = [
  'Penalaran_Umum',
  'Pengetahuan_Pemahaman_Umum',
  'Pemahaman_Bacaan_Menulis',
  'Pengetahuan_Kuantitatif',
  'Literasi_Bahasa_Indonesia',
  'Literasi_Bahasa_Inggris',
  'Penalaran_Matematika',
];

export default function ResultsTable({ results }: { results: any[] | null }) {
  if (!results) {
    return <div>No results available. Please process the data first.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Hasil Analisis</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Respondent</TableHead>
            {TEST_SECTIONS.flatMap((section) => [
              <TableHead key={`Benar_${section}`}>Benar_{section}</TableHead>,
              <TableHead key={`Salah_${section}`}>Salah_{section}</TableHead>,
              <TableHead key={`Theta_${section}`}>Theta_{section}</TableHead>,
              <TableHead key={`SNBT_${section}`}>SNBT_{section}</TableHead>,
            ])}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.Respondent}</TableCell>
              {TEST_SECTIONS.flatMap((section) => [
                <TableCell key={`Benar_${section}`}>
                  {row[`Benar_${section}`]}
                </TableCell>,
                <TableCell key={`Salah_${section}`}>
                  {row[`Salah_${section}`]}
                </TableCell>,
                <TableCell key={`Theta_${section}`}>
                  {row[`Theta_${section}`]}
                </TableCell>,
                <TableCell key={`SNBT_${section}`}>
                  {row[`SNBT_${section}`]}
                </TableCell>,
              ])}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
