'use client';

import { Badge } from '@/components/ui/badge';
import { ComboboxSelect } from '@/components/ui/combobox-select';
import { Label } from '@/components/ui/label';
import { useProvider } from '../_provider';

type UniversityType = {
  university: string;
  initials: string;
  averageScore: number;
  referensi: string | null;
  studyProgramList: {
    study: string;
    averageScore: number | null;
    passingGrade?: number;
  }[];
};

export default function PredictionStep1() {
  // const [selectedPrograms, setSelectedPrograms] =
  //   useState<UniversityType['studyProgramList'][0]>();

  // const { data: University }: UseGetDataType<UniversityType> = useGet(
  //   '/universitas/single',
  //   {
  //     params: { name: 'ui' },
  //   },
  // );

  // const studyChoices = University?.studyProgramList || [];

  // console.log({ University, studyChoices });

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
        {/* <Popover
          open={programSearchOpen}
          onOpenChange={setProgramSearchOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-12"
              disabled={selectedPrograms.length >= 3}
            >
              {selectedPrograms.length >= 3
                ? 'Maksimal 3 jurusan dipilih'
                : 'Pilih jurusan...'}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0"
            align="start"
          >
            <Command>
              <CommandInput
                placeholder="Cari jurusan atau fakultas..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>Tidak ditemukan</CommandEmpty>
                <CommandGroup>
                  {filteredPrograms.map((program) => {
                    const isSelected = selectedPrograms.some(
                      (sp) => sp.program.id === program.id,
                    );
                    return (
                      <CommandItem
                        key={program.id}
                        onSelect={() => !isSelected && addProgram(program)}
                        disabled={isSelected}
                        className={isSelected ? 'opacity-50' : ''}
                      >
                        <div className="flex flex-col flex-1">
                          <span className="font-medium">{program.nama}</span>
                          <span className="text-sm text-gray-500">
                            {program.fakultas}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="ml-2 h-4 w-4 text-green-600" />
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover> */}
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

      {/* Selected Programs */}
      {/* <div className="space-y-6">
        <h3 className="text-lg font-semibold text-center">Jurusan Dipilih</h3>
        {!selectedPrograms ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              Belum ada jurusan yang dipilih
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Pilih minimal 1 jurusan untuk melanjutkan
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <Card
              key={selectedPrograms.study}
              className="border-2"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {selectedPrograms.study}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {sp.program.fakultas}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProgram(sp.program.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="view"
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="view">Lihat PG</TabsTrigger>
                    <TabsTrigger value="edit">Edit PG</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="view"
                    className="space-y-3"
                  >
                    {sp.customPassingGrades.map((pg, pgIndex) => (
                      <div
                        key={pgIndex}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{pg.sumber}</p>
                          <p className="text-xs text-gray-500">
                            {pg.nilai}
                            {pg.tipe === 'persentase' ? '%' : ''}
                          </p>
                        </div>
                        <Badge
                          variant={pg.tipe === 'skor' ? 'default' : 'secondary'}
                        >
                          {pg.tipe === 'skor' ? 'Skor' : '%'}
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent
                    value="edit"
                    className="space-y-4"
                  >
                    {sp.customPassingGrades.map((pg, pgIndex) => (
                      <div
                        key={pgIndex}
                        className="space-y-3 p-4 border rounded-lg"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium">
                              Sumber
                            </Label>
                            <Input
                              value={pg.sumber}
                              onChange={(e) =>
                                updateCustomPassingGrade(
                                  index,
                                  pgIndex,
                                  'sumber',
                                  e.target.value,
                                )
                              }
                              className="h-9 mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium">Nilai</Label>
                            <Input
                              type="number"
                              value={pg.nilai || ''}
                              onChange={(e) =>
                                updateCustomPassingGrade(
                                  index,
                                  pgIndex,
                                  'nilai',
                                  Number.parseFloat(e.target.value) || 0,
                                )
                              }
                              className="h-9 mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Select
                            value={pg.tipe}
                            onValueChange={(value) =>
                              updateCustomPassingGrade(
                                index,
                                pgIndex,
                                'tipe',
                                value as 'skor' | 'persentase',
                              )
                            }
                          >
                            <SelectTrigger className="w-28 h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="skor">Skor</SelectItem>
                              <SelectItem value="persentase">%</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeCustomPassingGrade(index, pgIndex)
                            }
                            disabled={sp.customPassingGrades.length <= 1}
                            className="h-9 text-red-600 hover:bg-red-50"
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                    {sp.customPassingGrades.length < 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addCustomPassingGrade(index)}
                        className="w-full h-9"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Tambah PG
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div> */}
    </div>
  );
}
