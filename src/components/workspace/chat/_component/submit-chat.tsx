import ButtonPayment from '@/app/[web_sub_category]/(user)/user/_components/button-payment';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/session-provider-auth';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper';
import { IconLock, IconSend, IconUnlimited } from '@/styles/icon';
import { BanIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface Props {
  prevChatMessages: any;
  handleInputChange: any;
  setFirstMessage: any;
  limitaionUsed: any;
  isLoading: boolean;
  setShowUpgrade: any;
  showUpgrade: any;
  handleSubmit: any;
  input: any;
}

const SubmitChat = ({
  prevChatMessages,
  handleInputChange,
  setFirstMessage,
  limitaionUsed,
  isLoading,
  setShowUpgrade,
  showUpgrade,
  handleSubmit,
  input,
}: Props) => {
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

  const [send, setSend] = useState<boolean>(false);
  const { setTransactionPopUp } = useAppContext();

  const handleSubmitChatDefault = async () => {
    try {
      console.log('Func');
      const data: any = await limitation({ chat: true });
      console.log('data', data);
      const inputChat = document.getElementById(
        'inputChat',
      ) as HTMLTextAreaElement;
      const e = {
        target: {
          value: inputChat.value,
        },
      };
      if (data && !data.status) {
        toaster({
          title: 'Uppss',
          condition: 'warning',
          description: data.message,
          duration: 5000,
        });
        return;
      } else if (data && data.status) {
        if (prevChatMessages?.length === 0) {
          setFirstMessage(true);
          handleInputChange(e);
        } else {
          handleInputChange(e);
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

  useEffect(() => {
    const inputChat = document.getElementById(
      'inputChat',
    ) as HTMLTextAreaElement;
    if (input.length > 0) {
      handleSubmit();
      inputChat.value = '';
    }
  }, [input]);

  return (
    <form
      id="chatAI"
      onSubmit={(e) => {
        console.log('Masuk');
        handleSubmitChatDefault();
        e.preventDefault();
      }}
    >
      <div className="mb-2 mt-1 flex w-full">
        <div className="relative flex w-full items-center px-[1.5rem] py-[.5rem]">
          {limitaionUsed?.user.Role !== 'ADMIN' &&
          limitaionUsed?.chat >= limitaionUsed?.Limit?.chat ? (
            <p className="absolute bottom-[90%] left-0 w-full bg-bg-workspace pl-[1.5rem] text-[.9rem] text-main-gray-text">
              Limit chat tercapai.{' '}
              <AnimatedGradientText className="cursor-pointer md:hover:underline">
                Upgrade akunmu
              </AnimatedGradientText>{' '}
              untuk lanjut
            </p>
          ) : limitaionUsed?.chat < limitaionUsed?.Limit?.chat ? (
            <p className="absolute bottom-[90%] left-0 w-full bg-bg-workspace pl-[1.5rem] text-[.9rem] text-main-gray-text">
              <span className="text-[#F9791F]">
                {limitaionUsed?.chat}/
                {limitaionUsed?.Limit && limitaionUsed?.Limit.chat} chat
                tersisa.
              </span>{' '}
              <AnimatedGradientText
                className="cursor-pointer md:hover:underline"
                onClick={() => {
                  setTransactionPopUp(true);
                }}
              >
                Upgrade akunmu
              </AnimatedGradientText>{' '}
              untuk akses lebih banyak
            </p>
          ) : null}
          {limitaionUsed?.user.Role === 'ADMIN' && (
            <div className="absolute bottom-[90%] left-0 flex w-full flex-wrap items-center gap-[.3rem] bg-bg-workspace pl-[1.5rem] text-[.9rem] text-main-gray-text">
              <div className="flex items-center gap-[.3rem] text-[#F9791F]">
                <div className="flex items-center">
                  <IconUnlimited w={15} />/<IconUnlimited w={15} />
                </div>
                <p className="whitespace-nowrap">chat tersisa.</p>
              </div>
              <div className="flex items-center gap-[.3rem]">
                <AnimatedGradientText
                  className="cursor-pointer whitespace-nowrap md:hover:underline"
                  onClick={() => {
                    setTransactionPopUp(true);
                  }}
                >
                  Upgrade akunmu
                </AnimatedGradientText>
              </div>
              <span className="whitespace-nowrap break-words">
                untuk akses lebih banyak
              </span>
            </div>
          )}
          <TextareaAutosize
            id="inputChat"
            maxLength={1000}
            placeholder="Ajukan pertanyaan"
            className="max-h-[52px] w-full flex-1 resize-none rounded-[.6rem] border border-main py-[.8rem] pl-[1rem] pr-[4rem] text-[.8rem] font-normal outline-none md:max-h-[unset]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSubmitChatDefault();
                console.log('Masuk2');
              } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log('Masuk3');
              }
            }}
            onChange={(e) => {
              console.log('inputLength', e.target.value.length);
              if (e.target.value.length > 0) setSend(true);
              else setSend(false);
              if (e.target.value.length > 1000)
                e.target.value = e.target.value.slice(0, 1000);
              if (e.target.value.length === 1000)
                toaster({
                  title: 'Upss',
                  condition: 'warning',
                  description: 'Maksimal 1000 karakter input chat!',
                  duration: 3000,
                });
            }}
            autoFocus
            maxRows={4}
          />
          {limitaionUsed?.chat >= limitaionUsed?.Limit?.chat ? (
            <button
              className="relative w-fit px-2"
              onMouseOver={() => {
                setShowUpgrade(true);
              }}
              onMouseLeave={() => {
                setShowUpgrade(false);
              }}
            >
              <IconLock
                w={24}
                className="cursor-default rounded-[50%] bg-main-gray-disabled p-[.2rem] text-white"
              />
              {showUpgrade && (
                <div className="absolute bottom-[calc(100%+.5rem)] right-[-1.5rem] flex w-[250px] flex-col gap-[1rem] rounded-[1rem] bg-[#1A1E25] p-[1rem] text-start text-main-gray-text2">
                  <p className="font-regular text-[1rem] text-white">
                    Limit material
                  </p>
                  <p className="mt-[-.5rem] text-[.9rem]">
                    Limit kamu terbatas.{' '}
                    <span className="font-regular text-main">Upgrade akun</span>{' '}
                    untuk mendapatkan akses material lengkap.
                  </p>
                  <ButtonPayment text="Subscription" />
                  <div className="absolute bottom-[-8px] right-[2rem] h-[20px] w-[20px] rotate-45 bg-[#1A1E25]" />
                </div>
              )}
            </button>
          ) : (
            <>
              {isLoading ? (
                <button className="w-fit px-2">
                  <BanIcon
                    size={24}
                    className="text-red-500"
                    onClick={stop}
                  />
                </button>
              ) : (
                <>
                  {send ? (
                    <button
                      id="submitMessages"
                      className="group absolute right-8 w-fit rounded-ee-md rounded-se-md px-2"
                      type="submit"
                    >
                      <IconSend className="text-main duration-200 hover:text-main-hover" />
                    </button>
                  ) : (
                    <div className="group absolute right-8 w-fit rounded-ee-md rounded-se-md px-2">
                      <IconSend className="text-main-gray-disabled" />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default SubmitChat;
