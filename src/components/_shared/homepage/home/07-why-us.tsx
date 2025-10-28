'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';
import { IconBook, IconChat, IconStar } from '@/styles/icon';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

const WhyUs = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [active, setActive] = useState<number>(1);

  // Get dynamic colors
  const isMainLandingPage = window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  const heading = [
    {
      title: 'Blueprint Results',
      icon: <IconBook w={20} />,
      description: 'Track record yang speak for itself',
    },
    {
      title: 'AI Technology',
      icon: <IconStar w={20} />,
      description: 'Cutting-edge AI yang bikin breakthrough',
    },
    {
      title: 'Hero Method',
      icon: <IconChat w={20} />,
      description: 'Proven methodology vs random teaching',
    },
  ];

  const data = [
    {
      heading: 'Success Rate',
      one: '97% students reach target +200',
      two: '20-30% inconsistent results',
      three: '40-60% basic improvement',
      icon: '🏆',
    },
    {
      heading: 'Blueprint Method',
      one: '5-step proven methodology',
      two: 'No structured approach',
      three: 'Traditional one-size-fits-all',
      icon: '📋',
    },
    {
      heading: 'Transformation Time',
      one: '2-4 weeks visible progress',
      two: '6+ months uncertain growth',
      three: '4-8 months slow progress',
      icon: '⚡',
    },
    {
      heading: 'Investment Cost',
      one: 'Rp 299k/month (affordable)',
      two: 'Free but time = money',
      three: 'Rp 2-5 juta (expensive)',
      icon: '�',
    },
    {
      heading: 'Community Support',
      one: 'Exclusive Telegram heroes',
      two: 'No real community',
      three: 'Limited class interaction',
      icon: '�',
    },
    {
      heading: 'Progress Tracking',
      one: 'Real-time AI monitoring',
      two: 'Manual self-assessment',
      three: 'Weekly teacher evaluation',
      icon: '�',
    },
    {
      heading: 'Personalization',
      one: 'AI adapts to your weakness',
      two: 'You figure it out yourself',
      three: 'Same material for everyone',
      icon: '🎯',
    },
    {
      heading: 'Real Results',
      one: 'Heroes testimoni yang real',
      two: 'No proven track record',
      three: 'Marketing claims only',
      icon: '✅',
    },
  ];

  return (
    <section
      id="whyUs"
      className="py-16 md:py-24 relative overflow-hidden bg-white"
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <Badge
          variant="outline"
          className="mb-6 px-6 py-2 text-sm font-semibold text-white border-none items-center gap-2 mx-auto"
          style={{ backgroundColor: mainColor }}
        >
          <Star className="w-5 h-5" />
          Blueprint Advantage
        </Badge>

        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Masih <span className="text-red-500">Hopeless</span> Milih Bimbel
          Biasa?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stop buang duit buat bimbel yang{' '}
          <span className="font-bold text-gray-900">
            cuma ngasih harapan palsu
          </span>
          ! Ini facts kenapa{' '}
          <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Blueprint method crush semua kompetitor
          </span>
        </p>
      </motion.div>

      {/* Enhanced Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex justify-center mb-12"
      >
        <div className="bg-white rounded-3xl p-2 shadow-xl border-2 border-main-default/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {heading?.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center gap-3 rounded-2xl px-6 py-4 text-center transition-all duration-300 min-w-[200px] ${
                  active === 1 + i
                    ? 'text-white shadow-lg bg-gradient-default'
                    : 'text-gray-600 hover:bg-white bg-transparent'
                }`}
                onClick={() => setActive(1 + i)}
              >
                <div
                  className={`p-2 rounded-2xl ${active === 1 + i ? 'bg-white/20' : 'bg-gray-100'}`}
                >
                  <div
                    className={cn(
                      active === 1 + i ? 'text-white' : 'text-main-default',
                    )}
                  >
                    {item.icon}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-base">{item.title}</div>
                  <div
                    className={`text-xs mt-1 ${active === 1 + i ? 'text-white/80' : 'text-gray-500'}`}
                  >
                    {item.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Content Sections */}
      <div className="container p-8 mx-auto">
        {active === 1 && <EvaluationSection mainColor={mainColor} />}
        {active === 2 && <AIModelSection mainColor={mainColor} />}
        {active === 3 && (
          <ComparisonSection
            data={data}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        )}
      </div>
    </section>
  );
};

// Enhanced Evaluation Section
const EvaluationSection = ({ mainColor }: { mainColor: string }) => (
  <div className="space-y-8">
    <div className="text-center">
      <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
        <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Blueprint Bimbelio
        </span>{' '}
        menggunakan GPT-4o yang terbukti transform hopeless students jadi heroes
        dengan track record 97% success rate. Real results, bukan janji kosong!
      </p>
    </div>

    <Card className="border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden">
      <CardContent className="p-8">
        <ChartTwo />
      </CardContent>
    </Card>
  </div>
);

// Enhanced AI Model Section
const AIModelSection = ({ mainColor }: { mainColor: string }) => (
  <div className="space-y-8">
    <div className="text-center">
      <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
        <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Blueprint AI Technology
        </span>{' '}
        powered by GPT-4o yang proven punya tingkat akurasi tertinggi. Bukan
        cuma hype, tapi real cutting-edge tech yang bikin breakthrough!
      </p>
    </div>

    <Card className="border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden">
      <CardContent className="p-8">
        <Chart />
      </CardContent>
    </Card>
  </div>
);

// Enhanced Comparison Section
const ComparisonSection = ({
  data,
  mainColor,
  secondaryColor,
}: {
  data: any[];
  mainColor: string;
  secondaryColor: string;
}) => (
  <Card className="border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden">
    <CardHeader className="text-center py-8 bg-main-default/10">
      <CardTitle className="text-2xl font-bold text-main-default">
        Perbandingan Metode Belajar
      </CardTitle>
      <CardDescription className="text-lg">
        Lihat mengapa Bimbelio unggul dibanding metode pembelajaran lainnya
      </CardDescription>
    </CardHeader>

    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Enhanced Header */}
          <div className="grid grid-cols-4 border-b-2 border-gray-200">
            <div className="p-6"></div>
            <div className="p-6 text-center border-x-2 border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="text-white">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Blueprint Bimbelio</h3>
                <p className="text-sm opacity-90">Heroes Factory</p>
              </div>
            </div>
            <div className="p-6 text-center bg-white">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gray-200 flex items-center justify-center">
                <span className="text-xl">📖</span>
              </div>
              <h3 className="text-lg font-bold text-gray-700">Self Study</h3>
              <p className="text-sm text-gray-500">Hope & Pray Method</p>
            </div>
            <div className="p-6 text-center bg-white">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gray-200 flex items-center justify-center">
                <span className="text-xl">🏫</span>
              </div>
              <h3 className="text-lg font-bold text-gray-700">Bimbel Biasa</h3>
              <p className="text-sm text-gray-500">Old School Way</p>
            </div>
          </div>

          {/* Enhanced Data Rows */}
          {data?.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`grid grid-cols-4 border-b border-gray-100 ${
                i % 2 === 0 ? 'bg-white' : 'bg-white/50'
              }`}
            >
              <div className="p-6 flex items-center gap-3">
                <div className="text-2xl">{item.icon}</div>
                <span className="font-semibold text-gray-700">
                  {item.heading}
                </span>
              </div>
              <div className="p-6 text-center border-x border-gray-100 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-600">
                    {item.one}
                  </span>
                </div>
              </div>
              <div className="p-6 text-center flex items-center justify-center text-gray-600">
                {item.two}
              </div>
              <div className="p-6 text-center flex items-center justify-center text-gray-600">
                {item.three}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default WhyUs;
export { WhyUs };

// Enhanced Chart Components with better styling
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
    gpt4: { label: 'GPT-4', color: '#F46920' },
    gptv4: { label: 'ChatGPT-V4', color: '#51DA4C' },
    gptv3: { label: 'ChatGPT-V3', color: '#00CBBF' },
    gptv2: { label: 'ChatGPT-V2', color: '#3C46FF' },
  } satisfies ChartConfig;

  const sample = [
    { title: 'GPT-4', color: '#F46920' },
    { title: 'ChatGPT-V4', color: '#51DA4C' },
    { title: 'ChatGPT-V3', color: '#00CBBF' },
    { title: 'ChatGPT-V2', color: '#3C46FF' },
  ];

  return (
    <Card className="w-full border-0 bg-transparent shadow-none">
      <CardHeader className="pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              Internal Factual Eval by Category
            </CardTitle>
            <CardDescription className="text-base">
              Persentase estimasi akurasi dalam ujian berdasarkan kategori
            </CardDescription>
          </div>
          <div className="grid grid-cols-2 md:flex md:flex-col gap-3">
            {sample?.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-sm"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="gpt4"
                fill={chartConfig.gpt4.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                />
              </Bar>
              <Bar
                dataKey="gptv4"
                fill={chartConfig.gptv4.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                />
              </Bar>
              <Bar
                dataKey="gptv3"
                fill={chartConfig.gptv3.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                />
              </Bar>
              <Bar
                dataKey="gptv2"
                fill={chartConfig.gptv2.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-6 flex-col items-center gap-2">
        <p className="text-sm text-gray-500 text-center">Eval Benchmark</p>
        <p className="text-xs text-gray-400 text-center">
          Sumber: https://arxiv.org/abs/2407.09519
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
    gpt4_mini: { label: 'GPT-4o mini', color: '#F46920' },
    gemini_flash: { label: 'Gemini Flash', color: '#FFAF00' },
    claude_haiku: { label: 'Claude Haiku', color: '#01C159' },
    gpt35_turbo: { label: 'GPT-3.5 Turbo', color: '#00CBBF' },
  } satisfies ChartConfig;

  const sample = [
    { title: 'GPT-4o mini', color: '#F46920' },
    { title: 'Gemini Flash', color: '#FFAF00' },
    { title: 'Claude Haiku', color: '#01C159' },
    { title: 'GPT-3.5 Turbo', color: '#00CBBF' },
  ];

  return (
    <Card className="w-full border-0 bg-transparent shadow-none">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl font-bold mb-4">
          Model Evaluation Scores
        </CardTitle>
        <div className="grid grid-cols-2 md:flex items-center gap-4">
          {sample?.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
            >
              <div className="w-4 h-4 rounded-full shadow-sm bg-main-default" />
              <span className="text-sm font-medium text-gray-700">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-sm"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="gpt4_mini"
                fill={chartConfig.gpt4_mini.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                />
              </Bar>
              <Bar
                dataKey="gemini_flash"
                fill={chartConfig.gemini_flash.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                />
              </Bar>
              <Bar
                dataKey="claude_haiku"
                fill={chartConfig.claude_haiku.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                />
              </Bar>
              <Bar
                dataKey="gpt35_turbo"
                fill={chartConfig.gpt35_turbo.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-6 flex-col items-center gap-2">
        <p className="text-sm text-gray-500 text-center">Eval Benchmark</p>
        <p className="text-xs text-gray-400 text-center">
          Sumber:
          https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/
        </p>
      </CardFooter>
    </Card>
  );
}
