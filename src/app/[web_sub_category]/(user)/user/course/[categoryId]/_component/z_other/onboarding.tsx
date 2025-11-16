'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle,
  FileText,
  MessageCircle,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
  open: boolean;
  type: 'chat' | 'notes' | 'quiz' | 'tryout';
}

const OnBoarding = ({ open, type }: Props) => {
  const { setOnBoarding, onBoarding } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const handleClose = () => {
    // setOnBoarding({ ...onBoarding, [type]: false });
    if (type === 'chat') {
      setOnBoarding((prev: any) => ({ ...prev, chat: false }));
      localStorage.setItem(
        'on-boarding',
        JSON.stringify({ ...onBoarding, chat: false }),
      );
    } else if (type === 'notes') {
      setOnBoarding((prev: any) => ({ ...prev, notes: false }));
      localStorage.setItem(
        'on-boarding',
        JSON.stringify({ ...onBoarding, notes: false }),
      );
    } else if (type === 'quiz') {
      setOnBoarding((prev: any) => ({ ...prev, quiz: false }));
      localStorage.setItem(
        'on-boarding',
        JSON.stringify({ ...onBoarding, quiz: false }),
      );
    } else if (type === 'tryout') {
      setOnBoarding((prev: any) => ({ ...prev, tryout: false }));
      localStorage.setItem(
        'on-boarding',
        JSON.stringify({ ...onBoarding, tryout: false }),
      );
    }
  };

  const getOnboardingContent = () => {
    switch (type) {
      case 'chat':
        return <ChatAI />;
      case 'notes':
        return <Notes />;
      case 'quiz':
        return <QuizAI />;
      case 'tryout':
        return <Tryout />;
      default:
        return null;
    }
  };

  const getTypeConfig = () => {
    const configs = {
      chat: {
        title: 'Chat AI Assistant',
        icon: <MessageCircle className="w-6 h-6 text-white" />,
        gradient: 'from-blue-500 to-blue-600',
      },
      notes: {
        title: 'Smart Notes',
        icon: <FileText className="w-6 h-6 text-white" />,
        gradient: 'from-green-500 to-green-600',
      },
      quiz: {
        title: 'Quiz AI',
        icon: <Brain className="w-6 h-6 text-white" />,
        gradient: 'from-purple-500 to-purple-600',
      },
      tryout: {
        title: 'Try Out',
        icon: <Trophy className="w-6 h-6 text-white" />,
        gradient: 'from-orange-500 to-orange-600',
      },
    };
    return configs[type];
  };

  const config = getTypeConfig();

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="md:max-w-2xl w-[95%] mx-auto rounded-2xl overflow-hidden border-0 p-0">
        {/* Header */}
        <DialogHeader
          className="pb-4 px-6 pt-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br ${config.gradient} shadow-lg`}
                >
                  {config.icon}
                </div>
                <div>
                  <DialogTitle
                    className="text-xl font-bold"
                    style={{ color: mainColor }}
                  >
                    {config.title}
                  </DialogTitle>
                  <DialogDescription>
                    Panduan cepat untuk memulai
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="rounded-xl hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div
            className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-6">{getOnboardingContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default OnBoarding;

const ChatAI = () => {
  const { setOnBoarding, onBoarding } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [index, setIndex] = useState<number>(0);

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const steps = [
    {
      title: 'Selamat Datang di Chat AI',
      description:
        'Asisten cerdas yang siap membantu perjalanan belajar kamu 24/7',
      content: (
        <div className="text-center space-y-4">
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600">
            Chat AI akan membantu menjawab pertanyaan, menjelaskan konsep, dan
            memberikan panduan belajar yang personal.
          </p>
        </div>
      ),
    },
    {
      title: 'Cara Menggunakan',
      description: 'Tips untuk mendapatkan hasil terbaik dari Chat AI',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">
                Ajukan Pertanyaan Spesifik
              </h4>
              <p className="text-sm text-blue-700">
                Contoh: &quot;Jelaskan rumus integral by parts dengan contoh
                soal&quot;
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-green-900">
                Minta Penjelasan Detail
              </h4>
              <p className="text-sm text-green-700">
                AI akan memberikan penjelasan step-by-step yang mudah dipahami
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-purple-900">Follow Up</h4>
              <p className="text-sm text-purple-700">
                Jangan ragu untuk bertanya lebih lanjut jika belum paham
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Siap Memulai!',
      description: 'Chat AI sudah siap membantu perjalanan belajar kamu',
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Kamu sudah siap!
            </h4>
            <p className="text-gray-600">
              Mulai chat dengan AI sekarang dan dapatkan bantuan belajar yang
              kamu butuhkan.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[index];
  const progress = ((index + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-gray-500">
            {index + 1} dari {steps.length}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2"
          style={{ backgroundColor: `${mainColor}20` }}
        />
      </div>

      {/* Content */}
      <Card className="border-2 border-gray-100">
        <CardHeader className="text-center">
          <CardTitle
            className="text-xl"
            style={{ color: mainColor }}
          >
            {currentStep.title}
          </CardTitle>
          <p className="text-gray-600">{currentStep.description}</p>
        </CardHeader>
        <CardContent>{currentStep.content}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Sebelumnya
        </Button>

        {index < steps.length - 1 ? (
          <Button
            onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
            className="rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            Selanjutnya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setOnBoarding({ ...onBoarding, chat: false });
              localStorage.setItem(
                'on-boarding',
                JSON.stringify({ ...onBoarding, chat: false }),
              );
            }}
            className="rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Selesai
          </Button>
        )}
      </div>
    </div>
  );
};

const Notes = () => {
  const { setOnBoarding, onBoarding } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [index, setIndex] = useState<number>(0);

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const steps = [
    {
      title: 'Smart Notes AI',
      description:
        'Buat catatan cerdas dengan bantuan AI untuk pembelajaran yang lebih efektif',
      content: (
        <div className="text-center space-y-4">
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <FileText className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600">
            Fitur Notes AI membantu kamu membuat catatan yang terstruktur,
            ringkasan otomatis, dan mind map dari materi pembelajaran.
          </p>
        </div>
      ),
    },
    {
      title: 'Fitur Unggulan',
      description: 'Manfaatkan teknologi AI untuk catatan yang lebih efektif',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Auto Summary</h4>
            </div>
            <p className="text-sm text-blue-700">
              AI akan merangkum poin-poin penting dari materi
            </p>
          </div>
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-green-900">
                Smart Organization
              </h4>
            </div>
            <p className="text-sm text-green-700">
              Organisasi catatan otomatis berdasarkan topik
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Mulai Membuat Notes!',
      description: 'Siap untuk membuat catatan cerdas pertama kamu',
      content: (
        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Kamu sudah siap!
            </h4>
            <p className="text-gray-600">
              Mulai buat catatan dengan bantuan AI dan rasakan perbedaannya.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[index];
  const progress = ((index + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-gray-500">
            {index + 1} dari {steps.length}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2"
        />
      </div>

      <Card className="border-2 border-gray-100">
        <CardHeader className="text-center">
          <CardTitle
            className="text-xl"
            style={{ color: mainColor }}
          >
            {currentStep.title}
          </CardTitle>
          <p className="text-gray-600">{currentStep.description}</p>
        </CardHeader>
        <CardContent>{currentStep.content}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Sebelumnya
        </Button>

        {index < steps.length - 1 ? (
          <Button
            onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
            className="rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            Selanjutnya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setOnBoarding({ ...onBoarding, notes: false });
              localStorage.setItem(
                'on-boarding',
                JSON.stringify({ ...onBoarding, notes: false }),
              );
            }}
            className="rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Selesai
          </Button>
        )}
      </div>
    </div>
  );
};

const QuizAI = () => {
  const { setOnBoarding, onBoarding } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [index, setIndex] = useState<number>(0);

  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const steps = [
    {
      title: 'Quiz AI Adaptif',
      description:
        'Latihan soal yang menyesuaikan dengan kemampuan dan perkembangan kamu',
      content: (
        <div className="text-center space-y-4">
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, #9333ea)`,
            }}
          >
            <Brain className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600">
            Quiz AI menggunakan teknologi adaptif untuk memberikan soal yang
            sesuai dengan level kamu dan membantu peningkatan yang optimal.
          </p>
        </div>
      ),
    },
    {
      title: 'Siap Quiz!',
      description: 'Mulai latihan dengan Quiz AI sekarang',
      content: (
        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Let's Quiz!
            </h4>
            <p className="text-gray-600">
              Mulai latihan soal dengan AI dan tingkatkan kemampuan kamu.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[index];
  const progress = ((index + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-gray-500">
            {index + 1} dari {steps.length}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2"
        />
      </div>

      <Card className="border-2 border-gray-100">
        <CardHeader className="text-center">
          <CardTitle
            className="text-xl"
            style={{ color: mainColor }}
          >
            {currentStep.title}
          </CardTitle>
          <p className="text-gray-600">{currentStep.description}</p>
        </CardHeader>
        <CardContent>{currentStep.content}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Sebelumnya
        </Button>

        {index < steps.length - 1 ? (
          <Button
            onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
            className="rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, #9333ea)`,
            }}
          >
            Selanjutnya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setOnBoarding({ ...onBoarding, quiz: false });
              localStorage.setItem(
                'on-boarding',
                JSON.stringify({ ...onBoarding, quiz: false }),
              );
            }}
            className="rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, #9333ea)`,
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Selesai
          </Button>
        )}
      </div>
    </div>
  );
};

const Tryout = () => {
  const { setOnBoarding, onBoarding } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [index, setIndex] = useState<number>(0);

  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const steps = [
    {
      title: 'Try Out Simulation',
      description:
        'Simulasi ujian yang mendekati kondisi real untuk persiapan optimal',
      content: (
        <div className="text-center space-y-4">
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, #ea580c)`,
            }}
          >
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600">
            Try Out memberikan pengalaman ujian yang realistis dengan sistem
            penilaian yang akurat dan analisis mendalam.
          </p>
        </div>
      ),
    },
    {
      title: 'Siap Try Out!',
      description: 'Mulai simulasi ujian sekarang',
      content: (
        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Ready to Test!
            </h4>
            <p className="text-gray-600">
              Mulai try out dan uji kemampuan kamu dengan simulasi ujian yang
              menantang.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[index];
  const progress = ((index + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-gray-500">
            {index + 1} dari {steps.length}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2"
        />
      </div>

      <Card className="border-2 border-gray-100">
        <CardHeader className="text-center">
          <CardTitle
            className="text-xl"
            style={{ color: mainColor }}
          >
            {currentStep.title}
          </CardTitle>
          <p className="text-gray-600">{currentStep.description}</p>
        </CardHeader>
        <CardContent>{currentStep.content}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Sebelumnya
        </Button>

        {index < steps.length - 1 ? (
          <Button
            onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
            className="rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, #ea580c)`,
            }}
          >
            Selanjutnya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setOnBoarding({ ...onBoarding, tryout: false });
              localStorage.setItem(
                'on-boarding',
                JSON.stringify({ ...onBoarding, tryout: false }),
              );
            }}
            className="rounded-xl text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, #ea580c)`,
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Selesai
          </Button>
        )}
      </div>
    </div>
  );
};
