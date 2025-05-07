import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { IconBook, IconChat, IconStar } from '@/styles/icon';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

const WhyUs = () => {
  const [active, setActive] = useState<number>(1);
  const heading = [
    {
      title: 'Evaluasi Ujian',
      icon: <IconBook w={15} />,
    },
    {
      title: 'Model AI',
      icon: <IconStar w={15} />,
    },
    {
      title: 'Metode Belajar',
      icon: <IconChat w={15} />,
    },
  ];

  const data = [
    {
      heading: 'Fleksibilitas Waktu',
      one: 'Akses 24/7, kapan saja',
      two: 'Fleksibel, tapi tidak terstruktur',
      three: 'Terikat jadwal tetap',
    },
    {
      heading: 'Interaksi AI',
      one: 'AI responsif, feedback instan',
      two: 'Tidak ada interaksi langsung',
      three: 'Hanya saat kelas',
    },
    {
      heading: 'Pembelajaran',
      one: '100% personal, disesuaikan',
      two: 'Mengatur sendiri',
      three: 'Kurikulum sama untuk semua',
    },
    {
      heading: 'Biaya',
      one: 'Mulai Rp 99.000/bulan',
      two: 'Bervariasi, sering gratis',
      three: 'Rp 500.000 - Rp 3.000.000/program',
    },
    {
      heading: 'Akses Materi',
      one: '10.000+ soal up-to-date',
      two: 'Tergantung sumber',
      three: 'Terbatas kurikulum bimbel',
    },
    {
      heading: 'Latihan Soal & Quiz',
      one: '500+ soal baru/bulan',
      two: 'Bervariasi tergantung sumber',
      three: 'Berdasarkan kurikulum',
    },
    {
      heading: 'Feedback & Evaluasi',
      one: 'Evaluasi instan dari AI',
      two: 'Evaluasi mandiri',
      three: 'Hanya saat kelas',
    },
    {
      heading: 'Kemampuan Adaptasi',
      one: 'AI adaptif sesuai progres',
      two: 'Tidak ada penyesuaian',
      three: 'Penyesuaian terbatas',
    },
  ];

  return (
    <div
      id="whyUs"
      className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-[4rem]"
    >
      <div className="mx-[1rem] md:mx-0">
        <h1 className="mb-[1rem] text-center text-[1.5rem] font-bold text-main md:text-[2.5rem]">
          Mengapa Bimbelio?
        </h1>
        <p className="font-regular text-center text-main-gray-text sm:mt-[-1rem]">
          Keunggulan Bimbel Bimbelio untuk persiapan terbaik menuju kelulusanmu.
        </p>
        <div className="mt-[2rem] flex w-full items-center justify-center sm:mt-[1rem]">
          <div className="flex w-full flex-col items-center gap-[1rem] sm:w-[unset] sm:flex-row">
            {heading?.map((item: any, i: number) => (
              <div
                key={i}
                className={`flex w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[2rem] py-[.7rem] text-[.9rem] sm:w-[unset] sm:px-[1rem] ${
                  active === 1 + i
                    ? 'border border-transparent bg-gradient-default text-white md:hover:opacity-80'
                    : 'border border-main-gray-input bg-transparent text-main-gray-text md:hover:bg-main-gray-disabled'
                } duration-300`}
                onClick={() => setActive(1 + i)}
              >
                {item.icon}
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      {active === 1 && (
        <div className="">
          <div className="flex justify-center">
            <p className="w-full max-w-[700px] text-center text-main-gray-text">
              <span className="font-medium text-main">Bimbelio</span>{' '}
              menggunakan GPT-4o yang menunjukkan performa unggul dalam berbagai
              hasil ujian, memastikan hasil belajar yang optimal untuk persiapan
              PTN dan Kedinasan kamu.
            </p>
          </div>
          <div
            id="card"
            className="overflow-x-auto pb-[1rem]"
          >
            <div className="w-full px-[1rem] md:min-w-[1024px] lg:px-0">
              <div className="relative mx-auto mt-[4rem] flex w-[800px] items-center justify-center pl-[2rem] pr-[1rem]">
                <div className="absolute left-[-1rem] -rotate-90 text-[.9rem] text-main-gray-text2">
                  Accuracy (%)
                </div>
                <ChartTwo />
              </div>
            </div>
          </div>
        </div>
      )}
      {active === 2 && (
        <div className="">
          <div className="flex justify-center">
            <p className="w-full max-w-[700px] text-center text-main-gray-text">
              <span className="font-medium text-main">Bimbelio</span>{' '}
              menggunakan GPT-4o yang terbukti memiliki tingkat akurasi
              tertinggi dibandingkan model AI lainnya dalam berbagai benchmark
              evaluasi, memastikan pengalaman belajar yang lebih efektif dan
              terpercaya.
            </p>
          </div>
          <div
            id="card"
            className="overflow-x-auto pb-[1rem]"
          >
            <div className="w-full px-[1rem] md:min-w-[1024px] lg:px-0">
              <div className="relative mx-auto mt-[4rem] flex w-[800px] items-center justify-center pl-[2rem] pr-[1rem]">
                <div className="absolute left-[-1rem] -rotate-90 text-[.9rem] text-main-gray-text2">
                  Accuracy (%)
                </div>
                <Chart />
              </div>
            </div>
          </div>
        </div>
      )}
      {active === 3 && (
        <div
          id="card"
          className="overflow-x-auto pb-[1rem]"
        >
          <div className="w-full min-w-[1024px] px-[1rem] lg:px-0">
            <div className="grid grid-cols-4">
              <div className="block"></div>
              <div className="flex h-[70px] items-center justify-center gap-[1rem] rounded-t-[1rem] bg-gradient-default text-center">
                <h1 className="text-[1.2rem] font-medium text-white">
                  Bimbelio
                </h1>
              </div>
              <div className="flex h-[70px] items-center justify-center gap-[1rem] rounded-t-[1rem] text-center">
                <h1 className="text-[1.2rem] font-medium text-main-gray-text">
                  Belajar Mandiri
                </h1>
              </div>
              <div className="flex h-[70px] items-center justify-center gap-[1rem] rounded-t-[1rem] text-center">
                <h1 className="text-[1.2rem] font-medium text-main-gray-text">
                  Kelas Bimbel
                </h1>
              </div>
            </div>
            {data?.map((item: any, i: number) => (
              <div
                className="grid grid-cols-4"
                key={i}
              >
                <div
                  className={`${
                    i % 2 !== 0 ? 'bg-bg-workspace' : 'bg-white'
                  } flex h-[80px] items-center pl-[1rem] text-start font-medium text-main-gray-text`}
                >
                  {item.heading}
                </div>
                <div
                  className={`${
                    i % 2 !== 0 ? 'bg-bg-workspace' : 'bg-white'
                  } flex h-[80px] items-center justify-center border-l border-r border-main-default px-[1rem] text-center font-medium text-main-default ${
                    i === data.length - 1 && 'rounded-b-[1rem] border-b'
                  }`}
                >
                  {item.one}
                </div>
                <div
                  className={`${
                    i % 2 !== 0 ? 'bg-bg-workspace' : 'bg-white'
                  } font-regular flex h-[80px] items-center justify-center px-[1rem] text-center text-main-gray-text`}
                >
                  {item.two}
                </div>
                <div
                  className={`${
                    i % 2 !== 0 ? 'bg-bg-workspace' : 'bg-white'
                  } font-regular flex h-[80px] items-center justify-center px-[1rem] text-center text-main-gray-text`}
                >
                  {item.three}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyUs;

export function ChartTwo() {
  const chartData = [
    { month: 'Learning', gpt4: 75.0, gptv4: 58.5, gptv3: 53.0, gptv2: 48.5 },
    { month: 'Writing', gpt4: 72.0, gptv4: 56.0, gptv3: 51.0, gptv2: 46.0 },
    { month: 'Technology', gpt4: 70.0, gptv4: 52.0, gptv3: 47.0, gptv2: 42.0 },
    { month: 'History', gpt4: 71.0, gptv4: 54.0, gptv3: 49.0, gptv2: 44.0 },
    { month: 'Math', gpt4: 68.0, gptv4: 50.0, gptv3: 45.0, gptv2: 40.0 },
    { month: 'Science', gpt4: 69.0, gptv4: 53.0, gptv3: 48.0, gptv2: 43.0 },
    {
      month: 'Recommendation',
      gpt4: 67.0,
      gptv4: 51.0,
      gptv3: 46.0,
      gptv2: 41.0,
    },
  ];
  const chartConfig = {
    gpt4: {
      label: 'GPT-4',
      color: '#F46920',
    },
    gptv4: {
      label: 'ChatGPT-V4',
      color: '#51DA4C',
    },
    gptv3: {
      label: 'ChatGPT-V3',
      color: '#00CBBF',
    },
    gptv2: {
      label: 'ChatGPT-V2',
      color: '#3C46FF',
    },
  } satisfies ChartConfig;

  const sample = [
    {
      title: 'GPT-4',
      color: '#F46920',
    },
    {
      title: 'ChatGPT-V4',
      color: '#51DA4C',
    },
    {
      title: 'ChatGPT-V3',
      color: '#00CBBF',
    },
    {
      title: 'ChatGPT-V2',
      color: '#3C46FF',
    },
  ];
  return (
    <Card className="w-full border-none bg-transparent shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[1rem]">
              Internal factual eval by category
            </CardTitle>
            <CardDescription>
              Estimated percentage of accuracy in the exam
            </CardDescription>
          </div>
          <div className="flex flex-col">
            {sample?.map((item: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-[.5rem]"
              >
                <div
                  className={'p-[.4rem]'}
                  style={{ backgroundColor: `${item.color}` }}
                ></div>
                <p className="whitespace-nowrap text-[.8rem]">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: any) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="gpt4"
              fill={chartConfig.gpt4.color}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={7}
              />
            </Bar>
            <Bar
              dataKey="gptv4"
              fill={chartConfig.gptv4.color}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={7}
              />
            </Bar>
            <Bar
              dataKey="gptv3"
              fill={chartConfig.gptv3.color}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={7}
              />
            </Bar>
            <Bar
              dataKey="gptv2"
              fill={chartConfig.gptv2.color}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={7}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="mt-[-1rem] flex-col items-start gap-2 text-sm">
        <p className="w-full text-center text-[.8rem] text-main-gray-text2">
          Eval Benchmark
        </p>
        <p className="w-full text-center text-[.8rem] text-main-gray-text2">
          sumber: https://arxiv.org/abs/2407.09519
        </p>
      </CardFooter>
    </Card>
  );
}

export function Chart() {
  const chartData = [
    {
      month: 'MMLU',
      gpt4_mini: 82.0,
      gemini_flash: 77.9,
      claude_haiku: 73.8,
      gpt35_turbo: 69.8,
    },
    {
      month: 'GPQA',
      gpt4_mini: 40.2,
      gemini_flash: 38.6,
      claude_haiku: 35.7,
      gpt35_turbo: 30.8,
    },
    {
      month: 'DROP',
      gpt4_mini: 79.7,
      gemini_flash: 78.4,
      claude_haiku: 78.4,
      gpt35_turbo: 70.2,
    },
    {
      month: 'MGSM',
      gpt4_mini: 87.0,
      gemini_flash: 75.5,
      claude_haiku: 71.7,
      gpt35_turbo: 56.3,
    },
    {
      month: 'MATH',
      gpt4_mini: 70.2,
      gemini_flash: 40.9,
      claude_haiku: 40.9,
      gpt35_turbo: 43.1,
    },
    {
      month: 'HumanEval',
      gpt4_mini: 87.2,
      gemini_flash: 71.5,
      claude_haiku: 75.9,
      gpt35_turbo: 68.0,
    },
    {
      month: 'MMMU',
      gpt4_mini: 59.4,
      gemini_flash: 56.1,
      claude_haiku: 50.2,
      gpt35_turbo: 0.0,
    },
    {
      month: 'MathVista',
      gpt4_mini: 56.7,
      gemini_flash: 58.4,
      claude_haiku: 46.4,
      gpt35_turbo: 0.0,
    },
  ];

  const chartConfig = {
    gpt4_mini: {
      label: 'GPT-4o mini',
      color: '#F46920',
    },
    gemini_flash: {
      label: 'Gemini Flash',
      color: '#FFAF00',
    },
    claude_haiku: {
      label: 'Claude Haiku',
      color: '#01C159',
    },
    gpt35_turbo: {
      label: 'GPT-3.5 Turbo',
      color: '#00CBBF',
    },
  } satisfies ChartConfig;

  const sample = [
    {
      title: 'GPT-4o mini',
      color: '#F46920',
    },
    {
      title: 'Gemini Flash',
      color: '#FFAF00',
    },
    {
      title: 'Claude Haiku',
      color: '#01C159',
    },
    {
      title: 'GPT-3.5 Turbo',
      color: '#00CBBF',
    },
  ];

  return (
    <Card className="w-full border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-[1rem]">Model Evaluation Scores</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
        <div className="flex items-center gap-[1.5rem]">
          {sample?.map((item: any, i: number) => (
            <div
              key={i}
              className="flex items-center gap-[.5rem]"
            >
              <div
                className={'p-[.4rem]'}
                style={{ backgroundColor: `${item.color}` }}
              ></div>
              <p className="whitespace-nowrap text-[.8rem]">{item.title}</p>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: any) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="gpt4_mini"
              fill={chartConfig.gpt4_mini.color}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={7}
              />
            </Bar>
            <Bar
              dataKey="gemini_flash"
              fill={chartConfig.gemini_flash.color}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={7}
              />
            </Bar>
            <Bar
              dataKey="claude_haiku"
              fill={chartConfig.claude_haiku.color}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={7}
              />
            </Bar>
            <Bar
              dataKey="gpt35_turbo"
              fill={chartConfig.gpt35_turbo.color}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={7}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="mt-[-1rem] flex-col items-start gap-2 text-sm">
        <p className="w-full text-center text-[.8rem] text-main-gray-text2">
          Eval Benchmark
        </p>
        <p className="w-full text-center text-[.8rem] text-main-gray-text2">
          sumber:
          https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/
        </p>
      </CardFooter>
    </Card>
  );
}
