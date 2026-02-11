import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';
import { useProvider } from '../provider';

export default function ThreeQuestions() {
  const {
    useMessages: { appendMessages },
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
          setFirstMessage(true);
          await appendMessages({
            id: crypto.randomUUID(),
            content: value,
            role: 'user',
            createdAt: new Date(),
          });
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

  const firstName = session?.user?.name?.split(' ')[0] || 'User';

  return (
    <div className="flex h-full w-full items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <div
            className="w-10 h-10 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Bot className="w-5 h-5 text-white" />
          </div>

          <div className="space-y-0.5">
            <h1 className="text-base font-bold text-gray-900">
              Halo, {firstName}!
            </h1>
            <p className="text-gray-400 text-xs">
              Ada yang bisa BimBot bantu?
            </p>
          </div>
        </div>

        {/* Question Cards — bimboard rounded-3xl style */}
        <div className="flex flex-col gap-2 w-full">
          {ThirdQuestion.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className="group w-full text-left rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 p-3 transition-all duration-150 active:scale-[0.98] cursor-pointer"
                onClick={() => handleThreeQuestions(item.question)}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${mainColor}12` }}
                  >
                    <IconComponent
                      className="w-3.5 h-3.5"
                      style={{ color: mainColor }}
                    />
                  </div>
                  <p className="text-gray-600 text-xs font-medium leading-snug flex-1">
                    {item.question}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-gray-300 text-[10px] flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Powered by BimBot AI
        </p>
      </div>
    </div>
  );
}
