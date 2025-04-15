import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';

const TEST_SECTIONS = [
  'Penalaran_Umum',
  'Pengetahuan_Pemahaman_Umum',
  'Pemahaman_Bacaan_Menulis',
  'Pengetahuan_Kuantitatif',
  'Literasi_Bahasa_Indonesia',
  'Literasi_Bahasa_Inggris',
  'Penalaran_Matematika',
];

export default function DetailedResults({
  results,
}: {
  results: any[] | null;
}) {
  console.log({ results });

  const [searchTerm, setSearchTerm] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('Respondent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterSection, setFilterSection] = useState('all');

  if (!results) {
    return <div>No results available. Please process the data first.</div>;
  }

  //   const filteredResults = results
  //     .filter(
  //       (row) =>
  //         row.Respondent.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //         (filterSection === 'all' || row[`SNBT_${filterSection}`]),
  //     )
  //     .sort((a, b) => {
  //       if (a[sortColumn] < b[sortColumn])
  //         return sortDirection === 'asc' ? -1 : 1;
  //       if (a[sortColumn] > b[sortColumn])
  //         return sortDirection === 'asc' ? 1 : -1;
  //       return 0;
  //     });

  //   const pageCount = Math.ceil(filteredResults.length / itemsPerPage);
  //   const paginatedResults = filteredResults.slice(
  //     (currentPage - 1) * itemsPerPage,
  //     currentPage * itemsPerPage,
  //   );

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hasil Detail</CardTitle>
        <CardDescription>
          Tabel lengkap hasil analisis SNBT/UTBK per peserta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Cari berdasarkan ID Responden"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-1/3"
          />
          <Select
            value={filterSection}
            onValueChange={setFilterSection}
          >
            <SelectTrigger className="md:w-1/3">
              <SelectValue placeholder="Filter berdasarkan bagian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bagian</SelectItem>
              {TEST_SECTIONS.map((section) => (
                <SelectItem
                  key={section}
                  value={section}
                >
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(parseInt(value))}
          >
            <SelectTrigger className="md:w-1/3">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per halaman</SelectItem>
              <SelectItem value="20">20 per halaman</SelectItem>
              <SelectItem value="50">50 per halaman</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Hasil Analisis SNBT/UTBK</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('Respondent')}
                >
                  Respondent{' '}
                  {sortColumn === 'Respondent' &&
                    (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                {TEST_SECTIONS.flatMap((section) => [
                  <TableHead key={`Benar_${section}`}>
                    Benar_{section}
                  </TableHead>,
                  <TableHead key={`Salah_${section}`}>
                    Salah_{section}
                  </TableHead>,
                  <TableHead
                    key={`Theta_${section}`}
                    className="cursor-pointer"
                    onClick={() => handleSort(`Theta_${section}`)}
                  >
                    Theta_{section}{' '}
                    {sortColumn === `Theta_${section}` &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>,
                  <TableHead
                    key={`SNBT_${section}`}
                    className="cursor-pointer"
                    onClick={() => handleSort(`SNBT_${section}`)}
                  >
                    SNBT_{section}{' '}
                    {sortColumn === `SNBT_${section}` &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>,
                ])}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {paginatedResults.map((row, index) => (
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
              ))} */}
            </TableBody>
          </Table>
        </div>
        {/* <div className="flex justify-between items-center mt-4">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredResults.length)} of{' '}
            {filteredResults.length} results
          </div>
          <div className="space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
