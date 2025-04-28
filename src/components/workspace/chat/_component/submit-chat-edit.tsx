import { useAppContext } from "@/components/provider/provider-app";
import { useSession } from "@/components/provider/session-provider-auth";
import { toaster } from "@/components/ui/toaster";
import { mutateGeneral } from "@/lib/fetch-helper";
import { IconSend } from "@/styles/icon";

interface Props {
  editMessage: any;
  setEditMessage: any;
  setTempData: any;
  editOnChange: any;
  docId: string;
}

const SubmitChatEdit = ({
  setEditMessage,
  editMessage,
  setTempData,
  editOnChange,
  docId,
}: Props) => {
  const { messageData, setMessageData } = useAppContext();

  const { data: session } = useSession();
  // const limitation = api.user.limitation.useMutation();

  const limitation = async (payload: {
    chat?: boolean;
    vision?: boolean;
    notes?: boolean;
    quiz?: boolean;
  }) => {
    let sendData: any = null;
    await mutateGeneral("/user/limitation", {
      payload: {
        ...payload,
        userId: session?.user.id || "",
      },
      type: "post",
      toast: { hideSuccess: true },
      onSuccess({ data }) {
        sendData = data;
      },
    });
    return sendData;
  };

  // const editMessageApi = api.message.editMessages.useMutation({
  //   onSettled: async () => {},
  //   onMutate() {},
  // });

  const editMessageApi = async (payload: {
    docId: string;
    messageIndex: number;
  }) => {
    await mutateGeneral("/message/editMessages", {
      payload: {
        ...payload,
        userId: session?.user.id,
      },
      type: "post",
    });
  };

  const resetEdit = () => {
    setEditMessage((prev: any) => ({
      ...prev,
      bool: false,
      index: 99999,
      value: "",
    }));
  };

  const handleExecuteEditMessage = async () => {
    try {
      const inputChatEdit = document.getElementById(
        "editInput"
      ) as HTMLInputElement;
      const data: any = await limitation({ chat: true });
      if (data && !data.status) {
        toaster({
          title: "Uppss",
          condition: "warning",
          description: data.message,
          duration: 5000,
        });
        return;
      } else if (data && data.status) {
        try {
          resetEdit();
          const newMessage = messageData.filter(
            (item: any, i: number) => i <= editMessage.index - 1
          );
          setTempData([...newMessage]);
          setMessageData(() => [...newMessage]);
          const e: any = {
            target: {
              value: inputChatEdit.value,
            },
          };
          setEditMessage((prev: any) => ({
            ...prev,
            value: e.target.value,
          }));
          editOnChange(e);
          editMessageApi({
            docId: `${docId}`,
            messageIndex: editMessage.index,
          });
        } catch (error) {
          error;
        }
      }
    } catch (error) {
      toaster({
        title: "Gagal",
        condition: "warning",
        description: "Coba lagi nanti!",
      });
      return;
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <textarea
        id="editInput"
        placeholder="Edit your chat here..."
        className="h-[100px] w-full resize-none rounded-[1rem] border border-main-gray-input bg-white px-[1rem] py-[.5rem] text-[.9rem] outline-none"
        onChange={(e) => {
          console.log("inputLengthEdit", e.target.value.length);
          if (e.target.value.length > 1000) {
            e.target.value = e.target.value.slice(0, 1000);
          }
          if (e.target.value.length === 1000) {
            toaster({
              title: "Upss",
              condition: "warning",
              description: "Maksimal 1000 karakter input chat!",
              duration: 3000,
            });
          }
        }}
      />
      <div className="flex w-full justify-end gap-[.5rem] px-[1rem] pb-[1rem] text-[.9rem]">
        <button
          className="font-regular rounded-[.8rem] bg-transparent px-[1.2rem] py-[.7rem] text-main-gray-text duration-100 md:hover:text-main-gray-disabled"
          onClick={() => {
            resetEdit();
          }}
        >
          Batalkan
        </button>
        <button
          className="flex items-center gap-[.5rem] rounded-[.8rem] bg-main px-[1.2rem] py-[.7rem] text-white duration-100 hover:bg-main/85 md:active:bg-main"
          onClick={() => {
            handleExecuteEditMessage();
          }}
        >
          Kirim
          <IconSend w={15} />
        </button>
      </div>
    </div>
  );
};

export default SubmitChatEdit;
