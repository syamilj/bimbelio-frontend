import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response, responseError } from '@/lib/response';
import { getDateString } from '@/lib/utils';
import { TryoutCategory, TryoutSession } from '@/types/database';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import ModalEditCategory from './modal-edit-category';

interface CategoryWithSessions extends TryoutCategory {
  TryoutSession: TryoutSession[];
}

interface Props {
  categories: CategoryWithSessions[] | undefined;
  refresh: () => Promise<void>;
}

const TabContentCategory = ({ categories, refresh }: Props) => {
  // const { onOpen } = useModal();
  // const trpc = api.useUtils();

  const [open, setOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>(null);

  // const { mutate: deleteCategory } =
  //   api.tryoutCategory.deleteCategory.useMutation({
  //     onSuccess() {
  //       trpc.tryoutCategory.getCategoryWithTryoutSession.invalidate();
  //     },
  //   });

  const [, setIsLoading] = useState<boolean>(false);
  const deleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.delete(
        `/tryoutCategory/deleteCategory?id=${id}`,
      );
      await refresh();
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(categories, editData);

  return (
    <Table>
      {editData && (
        <ModalEditCategory
          setOpen={setOpen}
          open={open}
          data={editData}
          refresh={refresh}
        />
      )}
      <TableHeader>
        <TableRow>
          {/* <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead> */}
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Total Session</TableHead>
          <TableHead className="hidden md:table-cell">Created at</TableHead>
          <TableHead className="hidden md:table-cell">Updated at</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="group font-medium">{item.name}</TableCell>
            <TableCell className="hidden md:table-cell">
              {item.TryoutSession.length}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {getDateString(item.createAt)}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {getDateString(item.updateAt)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      setEditData({ category: { ...item } });
                      setOpen(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      deleteCategory(item.id);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TabContentCategory;
