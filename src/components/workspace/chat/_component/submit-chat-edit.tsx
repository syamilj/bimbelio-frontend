import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useProvider } from '../provider';

const SubmitChatEdit = () => {
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0066FF';

  const {
    messageData,
    setMessageData,
    setEditMessage,
    editMessage,
    useMessagesEdit: { handleInputChangeMessagesEdit },
  } = useProvider();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

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

  const editMessageApi = async (payload: {
    docId: string;
    messageIndex: number;
  }) => {
    await mutateGeneral('/message/editMessages', {
      payload: {
        ...payload,
        userId: session?.user.id,
      },
      type: 'put',
    });
  };

  const resetEdit = () => {
    setEditMessage((prev: any) => ({
      ...prev,
      bool: false,
      index: 99999,
      value: '',
    }));
  };

  const handleExecuteEditMessage = async () => {
    try {
      setIsSubmitting(true);
      const inputChatEdit = document.getElementById(
        'editInput',
      ) as HTMLInputElement;

      if (!inputChatEdit?.value.trim()) {
        toaster({
          title: 'Error',
          condition: 'warning',
          description: 'Pesan tidak boleh kosong!',
          duration: 3000,
        });
        setIsSubmitting(false);
        return;
      }

      const data: any = await limitation({ chat: true });
      if (data && !data.status) {
        toaster({
          title: 'Uppss',
          condition: 'warning',
          description: data.message,
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      } else if (data && data.status) {
        try {
          resetEdit();
          const newMessage = messageData.filter(
            (item: any, i: number) => i <= editMessage.index - 1,
          );
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
          handleInputChangeMessagesEdit(e);
          editMessageApi({
            docId: `${docId}`,
            messageIndex: editMessage.index,
          });
        } catch (error) {
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-3 bg-background border border-gray-200 rounded-3xl p-4">
      {/* Edit Header */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: mainColor }}
        />
        <span className="font-medium">Mengedit pesan</span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <TextareaAutosize
          id="editInput"
          placeholder="Edit pesan Kamu di sini..."
          defaultValue={editMessage.value}
          className={cn(
            'w-full resize-none rounded-3xl border-2 py-3 px-4 text-sm font-normal outline-none transition-all duration-200',
            'placeholder:text-gray-400',
            'bg-gray-50 border-gray-200',
            'focus:bg-white focus:border-2',
          )}
          style={{
            borderColor: `${mainColor}60`,
          }}
          onChange={(e) => {
            const length = e.target.value.length;
            setCharCount(length);

            if (length > 1000) {
              e.target.value = e.target.value.slice(0, 1000);
              setCharCount(1000);
            }
            if (length === 1000) {
              toaster({
                title: 'Upss',
                condition: 'warning',
                description: 'Maksimal 1000 karakter input chat!',
                duration: 3000,
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              resetEdit();
            }
            if (e.key === 'Enter' && e.ctrlKey) {
              handleExecuteEditMessage();
            }
          }}
          maxRows={8}
          minRows={3}
          disabled={isSubmitting}
        />

        {/* Character counter */}
        <div className="absolute bottom-2 right-3 text-xs text-gray-500 bg-background/80 px-2 py-1 rounded-3xl">
          <span>{charCount}/1000</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-3xl border-gray-200 hover:bg-gray-50"
          onClick={resetEdit}
          disabled={isSubmitting}
        >
          <X className="w-4 h-4 mr-2" />
          Batal
        </Button>

        <Button
          size="sm"
          className={cn(
            'rounded-3xl text-white shadow-lg transition-all duration-200',
            isSubmitting
              ? 'opacity-75 cursor-not-allowed'
              : 'hover:shadow-xl hover:scale-105',
          )}
          style={{ backgroundColor: mainColor }}
          onClick={handleExecuteEditMessage}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Menyimpan...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Simpan
            </>
          )}
        </Button>
      </div>

      {/* Helper Text */}
      <div className="text-xs text-gray-500 text-center pt-1 border-t border-gray-200">
        <span>Ctrl+Enter untuk simpan • Escape untuk membatalkan</span>
      </div>
    </div>
  );
};

export default SubmitChatEdit;
