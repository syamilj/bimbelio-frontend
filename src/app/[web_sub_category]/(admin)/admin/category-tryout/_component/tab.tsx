'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  TryoutCategory,
  TryoutSession,
  TryoutSubCategory,
} from '@/types/database';
import { ListFilter, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import CreateCategoryModal from './modal-create-category';
import CreateSubCategoryModal from './modal-create-sub-category';
import TabContentCategory from './tab-content-category';
import TabContentSubCategory from './tab-content-sub-category';

export interface CategoryWithSessions extends TryoutCategory {
  TryoutSession: TryoutSession[];
}
interface TryoutSubCategoryWithCategory extends TryoutSubCategory {
  TryoutCategory: TryoutCategory;
}

interface Props {
  categories: CategoryWithSessions[] | undefined;
  subCategories: TryoutSubCategoryWithCategory[] | undefined;
  refresh: () => Promise<void>;
}

const Tab = ({ categories, subCategories, refresh }: Props) => {
  // const { onOpen } = useModal();

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Tabs defaultValue="category">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="category">Category</TabsTrigger>
          <TabsTrigger value="subCategory">Sub Category</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1"
              >
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            className="h-7 gap-1"
            onClick={() => setOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add
            </span>
          </Button>
        </div>
      </div>
      {categories && categories.length > 0 ? (
        <>
          <TabsContent value="category">
            <CreateCategoryModal
              open={open}
              setOpen={setOpen}
              refresh={refresh}
            />
            <Card x-chunk="dashboard-06-chunk-1">
              <CardHeader>
                <CardTitle>Category</CardTitle>
                <CardDescription>
                  Manage your Category and view their exams.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TabContentCategory
                  categories={categories}
                  refresh={refresh}
                />
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="subCategory">
            <CreateSubCategoryModal
              categories={categories}
              open={open}
              setOpen={setOpen}
              refresh={refresh}
            />
            <Card x-chunk="dashboard-06-chunk-1">
              <CardHeader>
                <CardTitle>Sub Category</CardTitle>
                <CardDescription>
                  Manage your Sub Category and view their exams.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TabContentSubCategory
                  refresh={refresh}
                  subCategories={subCategories}
                  categories={categories}
                />
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </>
      ) : (
        <div className="flex flex-col items-center gap-y-8 pb-16">
          <CreateCategoryModal
            open={open}
            setOpen={setOpen}
            refresh={refresh}
          />
          <h2 className="text-heading-small">No content yet</h2>
          <p className="text-body-medium w-[300px] text-center text-gray-500">
            You haven&apos;t created any content yet. When you do, it&apos;ll
            show up here.
          </p>
          <div className="flex w-[240px] flex-col items-stretch">
            <Button onClick={() => setOpen(true)}>Create a Category</Button>
          </div>
        </div>
      )}
    </Tabs>
  );
};

export default Tab;
