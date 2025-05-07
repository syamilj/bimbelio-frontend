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
import { TryoutCategory, TryoutSubCategory } from '@/types/database';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import ModalEditSubCategory from './modal-edit-sub-category';
import { CategoryWithSessions } from './tab';

interface TryoutSubCategoryWithCategory extends TryoutSubCategory {
  TryoutCategory: TryoutCategory;
}

interface Props {
  subCategories: TryoutSubCategoryWithCategory[] | undefined;
  categories: CategoryWithSessions[] | undefined;
  refresh: () => Promise<void>;
}

const TabContentSubCategory = ({
  subCategories,
  categories,
  refresh,
}: Props) => {
  // const { onOpen } = useModal();
  // const trpc = api.useUtils();

  const [open, setOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>(null);

  // const { mutate: deleteSubCategory } =
  //   api.tryoutCategory.deleteSubCategory.useMutation({
  //     onSuccess() {
  //       trpc.tryoutCategory.getSubCategory.invalidate();
  //     },
  //   });
  const [, setIsLoading] = useState<boolean>(false);
  const deleteSubCategory = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.delete(
        `/tryoutCategory/deleteSubCategory?id=${id}`,
      );
      await refresh();
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(subCategories, editData);

  return (
    <Table>
      {editData && (
        <ModalEditSubCategory
          setOpen={setOpen}
          open={open}
          data={editData}
          categories={categories}
          refresh={refresh}
        />
      )}
      <TableHeader>
        <TableRow>
          {/* <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead> */}
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Category</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subCategories?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="group font-medium">{item.name}</TableCell>
            <TableCell className="hidden md:table-cell">
              {item.TryoutCategory.name}
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
                      setEditData({ subCategory: { ...item } });
                      setOpen(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      deleteSubCategory(item.id);
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

export default TabContentSubCategory;
