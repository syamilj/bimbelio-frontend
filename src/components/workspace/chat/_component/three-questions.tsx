import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';
import { useProvider } from '../provider';

export default function ThreeQuestions() {
  const {
    useMessages: { handleInputChangeMessages },
    setFirstMessage,
  } = useProvider();

  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const limitation = async (payload: {
    chat?: boolean;
    vision?: boolean;
    notes?: boolean;
    quiz?: boolean;
  }) => {
    let sendData: any = null;
    await mutateGeneral('/user/limitation', {
      payload: {
        ...payload,
        userId: session?.user.id || '',
      },
      type: 'post',
      toast: { hideSuccess: true },
      onSuccess({ data }) {
        sendData = data;
      },
    });
    return sendData;
  };

  const ThirdQuestion = [
    {
      question: 'Tolong buat ringkasan singkat dari dokumen ini!',
      icon: MessageCircle,
    },
    {
      question: 'Apa informasi kunci yang perlu diketahui dari dokumen ini?',
      icon: Sparkles,
    },
    {
      question: 'Bagaimana dokumen ini relevan dengan kebutuhan?',
      icon: Bot,
    },
  ];

  const handleThreeQuestions = async (value: string) => {
    try {
      const data: any = await limitation({ chat: true });
      if (data && !data.status) {
        toaster({
          title: 'Uppss',
          condition: 'warning',
          description: data.message,
          duration: 5000,
        });
        return;
      } else if (data && data.status) {
        try {
          const submit = document.getElementById(
            'submitMessages',
          ) as HTMLButtonElement;
          const e: any = {
            target: {
              value,
            },
          };
          handleInputChangeMessages(e);
          setFirstMessage(true);
          setTimeout(async () => {
            if (submit) {
              submit.click();
            }
          }, 50);
        } catch (error) {
          error;
        }
      }
    } catch (error) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
      return;
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <div className="flex h-full w-full max-w-4xl flex-col items-center justify-center gap-8 px-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div
            className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center shadow-lg mb-4"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Bot className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Halo,{' '}
              <span style={{ color: mainColor }}>{session?.user.name}</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Bagaimana kami dapat membantu Kamu hari ini?
            </p>
          </div>
        </div>

        {/* Question Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {ThirdQuestion.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white p-6 text-left shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                onClick={() => handleThreeQuestions(item.question)}
                style={{
                  borderColor: `${mainColor}20`,
                }}
              >
                {/* Background Pattern */}
                <div
                  className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10"
                  style={{ backgroundColor: mainColor }}
                />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: mainColor }}
                    />
                  </div>

                  <p className="text-gray-800 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                    {item.question}
                  </p>
                </div>

                {/* Hover Effect */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ backgroundColor: mainColor }}
                />
              </button>
            );
          })}
        </div>

        {/* Footer Text */}
        <div className="text-center space-y-3">
          <p className="text-gray-600">
            Atau ajukan pertanyaan khusus di kolom chat di bawah
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>Didukung oleh AI terdepan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
