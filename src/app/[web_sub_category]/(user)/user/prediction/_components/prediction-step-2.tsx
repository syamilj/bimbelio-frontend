import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AlertCircle, Info } from 'lucide-react';
import { useProvider } from '../_provider/provider';
import ScoreCard from './_components/score-card';
import SimpleBarChart from './_components/simple-bar-chart';

export default function PredictionStep2() {
  // const [utbkScores, setUtbkScores] = useState([
  //   {
  //     name: 'penalaran_umum',
  //     label: 'Penalaran Umum',
  //     score: 0,
  //   },
  //   {
  //     name: 'pengetahuan_pemahaman_umum',
  //     label: 'Pengetahuan & Pemahaman Umum',
  //     score: 0,
  //   },
  //   {
  //     name: 'pemahaman_bacaan_menulis',
  //     label: 'Pemahaman Bacaan & Menulis',
  //     score: 0,
  //   },
  //   {
  //     name: 'penalaran_kuantitatif',
  //     label: 'Penalaran Kuantitatif',
  //     score: 0,
  //   },
  //   {
  //     name: 'literasi_bahasa_indonesia',
  //     label: 'Literasi Bahasa Indonesia',
  //     score: 0,
  //   },
  //   {
  //     name: 'literasi_bahasa_inggris',
  //     label: 'Literasi Bahasa Inggris',
  //     score: 0,
  //   },
  //   {
  //     name: 'matematika',
  //     label: 'Matematika',
  //     score: 0,
  //   },
  // ]);
  const {
    utbkScores,
    setUtbkScores,
    useScoreUtbk: { utbkAvg, utbkPercentage },
  } = useProvider();
  // const results = {
  //   total: utbkScores.reduce((acc, item) => {
  //     return acc + item.score;
  //   }, 0),
  //   average:
  //     utbkScores.reduce((acc, item) => {
  //       return acc + item.score;
  //     }, 0) / utbkScores.length,
  //   percentage:
  //     utbkScores.reduce((acc, item) => {
  //       return acc + item.score;
  //     }, 0) / 1000,
  // };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Input Nilai UTBK
        </h2>
        <p className="text-gray-600">
          Masukkan nilai UTBK (100-1000). Kosongkan jika tidak ada nilai.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <div className="grid gap-6">
            {utbkScores.map((item, index) => (
              <div
                key={index}
                className="space-y-2"
              >
                <Label className="text-sm font-medium flex items-center justify-between">
                  <span>{item.label}</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rentang nilai: 100.00 - 1000.00</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="number"
                  max="1000"
                  step="0.01"
                  value={item.score}
                  onChange={(e) => {
                    setUtbkScores((prev) =>
                      prev.map((utbk) => {
                        if (utbk.name === item.name) {
                          return { ...utbk, score: parseFloat(e.target.value) };
                        }
                        return utbk;
                      }),
                    );
                  }}
                  placeholder="Masukkan nilai..."
                  className="h-11"
                />
                {item.score !== null &&
                  (item.score < 100 || item.score > 1000) && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Nilai harus antara 100.00 - 1000.00
                    </p>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Visualization Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Visualisasi UTBK</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart
                data={utbkScores.map((item) => {
                  return item.score;
                })}
                labels={[
                  'PU',
                  'PPU',
                  'PBM',
                  'Kuant',
                  'Lit ID',
                  'Lit EN',
                  'Mat',
                ]}
                title="Distribusi Nilai UTBK"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* <ScoreCard
              title="Rata-rata"
              value={utbkAvg.toFixed(2)}
              color="blue"
            /> */}
            <ScoreCard
              title="Rata-rata UTBK"
              value={utbkAvg.toFixed(1)}
              subtitle={`${utbkScores.filter((item) => item.score > 0).length}/7 subtes diisi`}
              color="blue"
            />
            <ScoreCard
              title="Persentase"
              value={`${utbkPercentage.toFixed(1)}%`}
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
