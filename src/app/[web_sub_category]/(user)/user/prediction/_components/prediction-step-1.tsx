'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ComboboxSelect } from '@/components/ui/combobox-select';
import { Label } from '@/components/ui/label';
import { School, Trash2 } from 'lucide-react';
import { useProvider } from '../_provider/provider';

export default function PredictionStep1() {
  const { selectedPrograms, setSelectedPrograms, studyChoices } = useProvider();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pilih Jurusan Target
        </h2>
        <p className="text-gray-600">
          Pilih maksimal 3 jurusan yang ingin kamu masuki
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Cari Jurusan</Label>
          <Badge
            variant="outline"
            className="font-medium"
          >
            {/* {selectedPrograms.length}/3 dipilih */}
          </Badge>
        </div>
        <ComboboxSelect
          className="h-12 rounded-xl"
          placeholder="Pilih jurusan"
          value={selectedPrograms?.study || ''}
          setValue={(value) => {
            const data = studyChoices.find((item) => item.study === value);
            if (data) {
              setSelectedPrograms(data);
            }
          }}
          options={studyChoices.map((item) => ({
            label: item.study,
            value: item.study,
          }))}
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-center">
          Program Studi Dipilih
        </h3>
        {!selectedPrograms ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
            <School className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              Belum ada program studi yang dipilih
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Pilih minimal 1 program studi untuk melanjutkan
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <Card
              key={selectedPrograms.study}
              className="border border-gray-200 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {selectedPrograms.study}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {selectedPrograms.fakultas}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    // onClick={() => removeProgram(sp.program.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Passing Grade:
                  </h4>
                  <div className="grid gap-2">
                    {selectedPrograms.passingGrade?.map((pg, pgIndex) => (
                      <div
                        key={pgIndex}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {pg.sumber.name}
                          </p>
                          <p className="text-xs text-gray-500">{pg.value}</p>
                        </div>
                        <Badge variant="outline">{pg.tipe}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
