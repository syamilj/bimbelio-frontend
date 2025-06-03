import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, BookOpen, Target } from 'lucide-react';
import { useProvider } from '../_provider';
import { validateSubtest } from '../_provider/helper';
import ScoreCard from './_components/score-card';
import SimpleBarChart from './_components/simple-bar-chart';

export default function PredictionStep3() {
  const {
    simakScores,
    setSIMAKScores,
    useScoreSimak: { simakAvg, simakPercentage, simakRawScore },
  } = useProvider();

  const updateSIMAKScore = (
    subTestName: string,
    type: 'benar' | 'salah' | 'kosong',
    value: number,
  ) => {
    setSIMAKScores((prev) =>
      prev.map((utbk) => {
        if (utbk.name === subTestName) {
          return {
            ...utbk,
            value: {
              ...utbk.value,
              [type]: value,
            },
          };
        }
        return utbk;
      }),
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Input Hasil TO SIMAK UI
        </h2>
        <p className="text-gray-600">
          Masukkan jumlah soal benar, salah, dan kosong. Total harus sesuai
          jumlah soal.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-3 space-y-8">
          {/* Kemampuan Dasar */}
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-main" />
                Kemampuan Dasar (45 Soal)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {simakScores
                  .filter((item) => item.type.name === 'kemampuan_dasar')
                  .map((item, index) => (
                    <div
                      key={index}
                      className="space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">{item.label}</Label>
                        <Badge variant="outline">
                          {item.total_question}
                          soal
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">
                            Benar
                          </Label>
                          <Input
                            type="number"
                            max={item.total_question}
                            value={item.value.benar}
                            onChange={(e) =>
                              updateSIMAKScore(
                                item.name,
                                'benar',
                                parseInt(e.target.value),
                              )
                            }
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">
                            Salah
                          </Label>
                          <Input
                            type="number"
                            max={item.total_question}
                            value={item.value.salah}
                            onChange={(e) =>
                              updateSIMAKScore(
                                item.name,
                                'salah',
                                parseInt(e.target.value),
                              )
                            }
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">
                            Kosong
                          </Label>
                          <Input
                            type="number"
                            max={item.total_question}
                            value={item.value.kosong}
                            onChange={(e) =>
                              updateSIMAKScore(
                                item.name,
                                'kosong',
                                parseInt(e.target.value),
                              )
                            }
                            className="h-10"
                          />
                        </div>
                      </div>
                      {!validateSubtest(item.value, item.total_question) && (
                        <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-3 rounded-lg">
                          <AlertCircle className="h-4 w-4" />
                          <span>
                            Total:{' '}
                            {item.value.benar +
                              item.value.salah +
                              item.value.kosong}{' '}
                            dari {item.total_question} soal
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Kemampuan Akademik */}
          <Card>
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Kemampuan Akademik (80 Soal)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {simakScores
                  .filter((item) => item.type.name === 'kemampuan_akademik')
                  .map((item, index) => (
                    <div
                      key={index}
                      className="space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">
                          {item.label.charAt(0).toUpperCase() +
                            item.label.slice(1)}
                        </Label>
                        <Badge variant="outline">
                          {item.total_question} soal
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">
                            Benar
                          </Label>
                          <Input
                            type="number"
                            max={item.total_question}
                            value={item.value.benar}
                            onChange={(e) =>
                              updateSIMAKScore(
                                item.name,
                                'benar',
                                parseInt(e.target.value),
                              )
                            }
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">
                            Salah
                          </Label>
                          <Input
                            type="number"
                            max={item.total_question}
                            value={item.value.salah}
                            onChange={(e) =>
                              updateSIMAKScore(
                                item.name,
                                'salah',
                                parseInt(e.target.value),
                              )
                            }
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">
                            Kosong
                          </Label>
                          <Input
                            type="number"
                            max={item.total_question}
                            value={item.value.kosong}
                            onChange={(e) =>
                              updateSIMAKScore(
                                item.name,
                                'kosong',
                                parseInt(e.target.value),
                              )
                            }
                            className="h-10"
                          />
                        </div>
                      </div>
                      {!validateSubtest(item.value, item.total_question) && (
                        <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-3 rounded-lg">
                          <AlertCircle className="h-4 w-4" />
                          <span>
                            Total:{' '}
                            {item.value.benar +
                              item.value.salah +
                              item.value.kosong}{' '}
                            dari {item.total_question} soal
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualization Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Visualisasi SIMAK</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart
                data={simakScores.map(
                  (item) => item.value.benar * 4 + item.value.salah * -1,
                )}
                labels={['MatDas', 'BI', 'BE', 'Verbal', 'Kuant', 'Logika']}
                title="Distribusi Nilai SIMAK"
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <ScoreCard
              title="Skor Mentah"
              value={simakRawScore.toString()}
              color="blue"
            />
            <ScoreCard
              title="Persentase"
              value={`${simakPercentage.toFixed(1)}%`}
              color="green"
            />
            <ScoreCard
              title="Rata-rata IRT"
              value={simakAvg.toFixed(1)}
              color="purple"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
