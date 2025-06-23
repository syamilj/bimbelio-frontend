import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { validateSubtest } from '../../_provider/helper';
import { useProvider } from '../../_provider/provider';
import ScoreCard from '../_components/score-card';
import SimpleBarChart from '../_components/simple-bar-chart';

export default function PredictionStep3() {
  const {
    simakScores,
    setSIMAKScores,
    useScoreSimak: {
      simakAvgSNBT,
      simakScoreSNBT,
      simakScoreRAW,
      simakMaxScoreRAW,
    },
    useParams: { predictionId, tryoutId: tryoutIdParams },
    useSelectTryouts: { SelectTryouts, tryoutId, setTryoutId },
  } = useProvider();

  const [tempDataSimakScores, setTempDataSimakScores] = useState<
    typeof simakScores
  >([]);

  const [simakCategory, setSimakCategory] = useState<{ name: string }[]>([
    {
      name: 'Kemampuan Dasar',
    },
    {
      name: 'Kemampuan Akademik',
    },
  ]);

  const [isSelectChange, setIsSelectChange] = useState<boolean>(false);

  type Test = typeof simakScores;

  useEffect(() => {
    if (isSelectChange || predictionId) {
      const category = simakScores.reduce(
        (acc: { name: string }[], item: Test[0]) => {
          const key = item.type.name as any;

          const find = acc.find((item) => item.name === key);
          if (!find) {
            acc.push({ name: item.type.name });
          }
          return acc;
        },
        [],
      );
      setSimakCategory(category);
      setIsSelectChange(false);
    }
  }, [simakScores, isSelectChange, predictionId]);

  const updateSIMAKScore = (
    subTestName: string,
    type: 'benar' | 'salah' | 'kosong',
    value: number,
  ) => {
    setSIMAKScores((prev) =>
      prev.map((utbk) => {
        if (utbk.name === subTestName) {
          const benar = type === 'benar' ? value : utbk.value.benar;
          const salah = type === 'salah' ? value : utbk.value.salah;
          const kosong = utbk.total_question - (benar + salah);
          return {
            ...utbk,
            value: {
              ...utbk.value,
              [type]: value,
              kosong: kosong >= 0 ? kosong : utbk.value.kosong,
            },
          };
        }
        return utbk;
      }),
    );
  };

  const onChangeTryout = (value: string) => {
    if (value === 'placeholder' && tempDataSimakScores.length > 0) {
      setSIMAKScores(tempDataSimakScores);
      setIsSelectChange(true);
      setTryoutId(null);
    }
    const findData = SelectTryouts?.find((item) => item.Tryout.id === value);
    if (!findData) return;
    const newDatas: typeof simakScores = findData.Datas.map((item) => ({
      initial: item.subCategory.name,
      name: item.subCategory.name,
      label: item.subCategory.name,
      total_question: item.value.totalQuestions,
      type: {
        label: item.category.name,
        name: item.category.name as any,
      },
      value: {
        benar: item.value.benar,
        salah: item.value.salah,
        kosong: item.value.kosong,
      },
    }));
    if (tempDataSimakScores.length === 0) {
      setTempDataSimakScores(simakScores);
    }
    setSIMAKScores(newDatas);
    setIsSelectChange(true);
    setTryoutId(value);
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

      <div className="">
        <Select
          disabled={!!tryoutIdParams && tryoutIdParams === tryoutId}
          onValueChange={onChangeTryout}
          value={tryoutId ? tryoutId : 'placeholder'}
        >
          <SelectTrigger>
            <SelectValue placeholder="Manual" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder">Manual</SelectItem>
            {SelectTryouts?.map((item, index) => (
              <SelectItem
                key={index}
                value={item.Tryout.id}
              >
                {item.Tryout.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {simakCategory.map((scItem, index) => (
            <Card key={index}>
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-main" />
                  {scItem.name} (45 Soal)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {simakScores
                    .filter((item) => item.type.name === scItem.name)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <Label className="font-medium">{item.name}</Label>
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
                              disabled
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
          ))}
        </div>

        {/* <div className="lg:col-span-3 space-y-8">
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
                            disabled
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
                            disabled
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
        </div> */}

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
                labels={simakScores.map((ssItem) => ssItem.name)}
                title="Distribusi Nilai SIMAK"
                max={simakMaxScoreRAW}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {/* <ScoreCard
              title="Skor Mentah"
              value={simakScoreRAW.toString()}
              color="blue"
            />
            <ScoreCard
              title="Persentase"
              value={`${simakPercentageRAW.toFixed(1)}%`}
              color="green"
            />
            <ScoreCard
              title="Rata-rata IRT"
              value={simakAvgSNBT.toFixed(1)}
              color="purple"
            /> */}
            <ScoreCard
              title="Skor Mentah"
              value={simakScoreRAW.toString()}
              subtitle={`dari ${simakMaxScoreRAW} maksimal`}
              color="purple"
            />
            <ScoreCard
              title="Konversi SNBT"
              value={simakAvgSNBT.toFixed(1)}
              subtitle="Skala 100-1000"
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
