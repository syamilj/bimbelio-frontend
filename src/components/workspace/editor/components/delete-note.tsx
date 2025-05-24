import { deleteHighlightMutationType } from '@/components/pdf-reader';
import { deleteGeneral } from '@/lib/fetch-helper';

import { RemoveBlockItem } from '@blocknote/react';

import { useSession } from '@/components/provider/provider-session-auth';
import { useProvider } from '../provider';

export function DeleteNote({ props }: { props: any }) {
  const { docId, editor } = useProvider();
  const { data: session } = useSession();

  const deleteHighlightMutation = async (
    params: deleteHighlightMutationType,
  ) => {
    await deleteGeneral('/highlight/delete', {
      params,
      onLoading() {
        //     await utils.document.getDocData.cancel();
        //     const prevData = utils.document.getDocData.getData();
        //     utils.document.getDocData.setData(
        //       { docId: docId as string, userId: userId as string },
        //       (old: any) => {
        //         if (!old) return undefined;
        //         return {
        //           ...old,
        //           highlights: old.highlights.filter(
        //             (highlight: HighlightType) =>
        //               highlight.id !== oldHighlight.highlightId,
        //           ),
        //         };
        //       },
        //     );
        //     return { prevData };
      },
      onSuccess() {
        // utils.document.getDocData.invalidate();
        localStorage.setItem(
          `notes-${docId}-${session?.user}`,
          JSON.stringify(editor?.document),
        );
      },
    });
  };
  return (
    <div
      onClick={() => {
        const data: any = props;
        const id = data.block.props.highlightId;
        console.log(data.block.props.highlightId);
        if (id) {
          deleteHighlightMutation({
            documentId: docId as string,
            highlightId: id,
            userId: session?.user.id || '',
          });
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
