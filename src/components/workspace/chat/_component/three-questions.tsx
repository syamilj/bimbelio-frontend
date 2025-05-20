import { useSession } from '@/components/provider/provider-session-auth';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper';
import { useProvider } from '../provider';

export default function ThreeQuestions() {
  const {
    useMessages: { handleInputChangeMessages },
    setFirstMessage,
  } = useProvider();

  const { data: session } = useSession();

  // const limitation = api.user.limitation.useMutation();

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
    },
    {
      question: 'Apa informasi kunci yang perlu diketahui dari dokumen ini?',
    },
    {
      question: 'Bagaimana dokumen ini relevan dengan kebutuhan?',
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
      <div className="flex h-full w-full max-w-[800px] flex-col items-center justify-center gap-[2rem] px-[1rem]">
        <h1 className="font-regular w-full text-[24px] text-main-gray-text">
          <span className="text-main">Halo, {session?.user.name}</span> <br />
          Bagaimana kami dapat membantu?
        </h1>
        <div className="grid grid-cols-1 gap-[1rem] font-medium text-main-gray-text md:h-[200px] md:grid-cols-3">
          {ThirdQuestion.map((item: any, i: number) => (
            <div
              key={i} // Adding key here
              className="rounded-[1rem] bg-white p-[1.5rem] duration-200 hover:shadow-xl"
              onClick={() => handleThreeQuestions(`${item.question}`)}
            >
              <p>{item.question}</p>
            </div>
          ))}
        </div>
        <p className="w-full text-main-gray-text">
          Atau ajukan pertanyaan dibawah.
        </p>
      </div>
    </div>
  );
}
