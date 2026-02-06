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
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full max-w-lg flex-col items-center justify-center gap-6 px-4">
        {/* Header Section - Modern & Clean */}
        <div className="text-center space-y-3">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Bot className="w-7 h-7 text-white" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900">
              Halo,{' '}
              <span style={{ color: mainColor }}>{session?.user.name}</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Bagaimana kami dapat membantu Kamu hari ini?
            </p>
          </div>
        </div>

        {/* Question Cards - Vertical Stack */}
        <div className="flex flex-col gap-3 w-full">
          {ThirdQuestion.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white p-4 text-left shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md hover:border-slate-300 active:scale-[0.98]"
                onClick={() => handleThreeQuestions(item.question)}
              >
                {/* Content */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${mainColor}12` }}
                  >
                    <IconComponent
                      className="w-4 h-4"
                      style={{ color: mainColor }}
                    />
                  </div>

                  <p className="text-slate-700 text-sm font-medium leading-relaxed flex-1 pt-1.5">
                    {item.question}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Text - Compact */}
        <div className="text-center space-y-2">
          <p className="text-slate-500 text-xs font-medium">
            Atau ajukan pertanyaan khusus di kolom chat di bawah
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="w-3 h-3" />
            <span>Powered by BimBot AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
