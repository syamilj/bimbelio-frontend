import { deleteHighlightMutationType } from '@/components/pdf-reader';
import { deleteGeneral } from '@/lib/fetch-helper/fetch-helper';

import { RemoveBlockItem } from '@blocknote/react';

import { useSession } from '@/components/provider/provider-session-auth';
import { usePathname } from 'next/navigation';
import { useProvider } from '../provider';

export function DeleteNote({ props }: { props: any }) {
  const { data: session } = useSession();
  const { editor } = useProvider();
  const pathname = usePathname();

  // Extract docId from pathname
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];

  const deleteHighlightMutation = async (
    params: deleteHighlightMutationType,
  ) => {
    await deleteGeneral('/highlight/deleteHighlight', {
      params,
      onSuccess: async () => {
        // Highlight berhasil dihapus dari database
      },
      onError: (error) => {
        console.error('Error deleting highlight:', error);
      },
    });
  };
  return (
    <div
      onClick={async () => {
        const data: any = props;
        const id = data.block.props.highlightId;

        // If this is a highlight block, handle deletion with PDF sync
        if (id && props?.block?.type === 'highlight') {
          try {
            // First dispatch the PDF removal event immediately
            const event = new CustomEvent('removeHighlightFromPdf', {
              detail: { highlightId: id },
            });
            window.dispatchEvent(event);

            // Then call the API to delete from database
            await deleteHighlightMutation({
              documentId: docId as string,
              highlightId: id,
              userId: session?.user.id || '',
            });
          } catch (error) {
            console.error('Error during highlight deletion:', error);
          }
        }

        localStorage.setItem(
          `notes-${docId}-${session?.user}`,
          JSON.stringify(editor?.document),
        );
      }}
    >
      <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
    </div>
  );
}
