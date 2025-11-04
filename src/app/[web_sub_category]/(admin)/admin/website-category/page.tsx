'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { DialogAddCategory } from './_components/dialog-add-category';
import { DialogAddSubCategory } from './_components/dialog-add-sub-category';
import { DialogDelete } from './_components/dialog-delete';
import { DialogEditCategory } from './_components/dialog-edit-category';
import { DialogEditSubCategory } from './_components/dialog-edit-sub-category';
import Provider, { useAdminWebCategory } from './provider';

export default function WebsiteCategoriesPage() {
  return (
    <Provider>
      <Content />
    </Provider>
  );
}

const Content = () => {
  const { categories, subCategories } = useAdminWebCategory();

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id);
  };
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold">
              {categories.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Web Category</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold">
              {subCategories.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total Sub Web Category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Web Category Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Web Category</h2>
          <DialogAddCategory>
            <Button className="bg-main hover:bg-main/80 duration-300">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Web Category
            </Button>
          </DialogAddCategory>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-3 border-b">No.</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Main Color</th>
                <th className="p-3 border-b">Secondary Color</th>
                {/* <th className="p-3 border-b">Gradient Color</th> */}
                <th className="p-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category.id}>
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">{category.name}</td>
                  <td className="p-3 border-b">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-24 h-8 rounded"
                        style={{ backgroundColor: category.main_color }}
                      ></div>
                      <span>{category.main_color}</span>
                    </div>
                  </td>
                  <td className="p-3 border-b">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-24 h-8 rounded"
                        style={{ backgroundColor: category.secondary_color }}
                      ></div>
                      <span>{category.secondary_color}</span>
                    </div>
                  </td>
                  {/* <td className="p-3 border-b">
                <div
                  className="w-24 h-8 rounded"
                  style={{
                    background: `linear-gradient(to right, ${category.main_color}, ${category.secondary_color})`,
                  }}
                ></div>
              </td> */}
                  <td className="p-3 border-b">
                    <div className="flex gap-2">
                      <DialogEditCategory category={category}>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </Button>
                      </DialogEditCategory>

                      <DialogDelete
                        id={category.id}
                        title="Delete Web Category"
                        description="Are you sure you want to delete this category? This will also delete all subcategories associated with it."
                        type="category"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </DialogDelete>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub Web Category Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sub Web Category</h2>
          <DialogAddSubCategory
            categories={categories}
            subCategories={subCategories}
          >
            <Button className="bg-main hover:bg-main/80 duration-300">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Sub Web Category
            </Button>
          </DialogAddSubCategory>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-3 border-b">No.</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Web Category</th>
                <th className="p-3 border-b">Main Color</th>
                <th className="p-3 border-b">Secondary Color</th>
                {/* <th className="p-3 border-b">Gradient Color</th> */}
                <th className="p-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((subCategory, index) => {
                const parentCategory = getCategoryById(
                  subCategory.website_category_id,
                );
                return (
                  <tr key={subCategory.id}>
                    <td className="p-3 border-b">{index + 1}</td>
                    <td className="p-3 border-b">{subCategory.name}</td>
                    <td className="p-3 border-b">{parentCategory?.name}</td>
                    <td className="p-3 border-b">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-24 h-8 rounded"
                          style={{ backgroundColor: subCategory.main_color }}
                        ></div>
                        <span>{subCategory.main_color}</span>
                      </div>
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-24 h-8 rounded"
                          style={{
                            backgroundColor: subCategory.secondary_color,
                          }}
                        ></div>
                        <span>{subCategory.secondary_color}</span>
                      </div>
                    </td>
                    {/* <td className="p-3 border-b">
                  <div
                    className="w-24 h-8 rounded"
                    style={{
                      background: `linear-gradient(to right, ${subCategory.main_color}, ${subCategory.secondary_color})`,
                    }}
                  ></div>
                </td> */}
                    <td className="p-3 border-b">
                      <div className="flex gap-2">
                        <DialogEditSubCategory
                          categories={categories}
                          subCategory={subCategory}
                          subCategories={subCategories}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <Pencil className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DialogEditSubCategory>

                        <DialogDelete
                          id={subCategory.id}
                          name={subCategory.name}
                          title="Delete Sub Web Category"
                          description="Are you sure you want to delete this subcategory?"
                          type="sub-category"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogDelete>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dialogs */}
      {/* <DialogAddCategory
  open={openCategoryDialog}
  onOpenChange={setOpenCategoryDialog}
  onSave={handleSaveCategory}
/> */}

      {/* <DialogAddSubCategory
    open={openSubCategoryDialog}
    onOpenChange={setOpenSubCategoryDialog}
    onSave={handleSaveSubCategory}
    categories={categories}
  /> */}

      {/* Edit Dialogs */}
      {/* <DialogEditCategory
    open={openEditCategoryDialog}
    onOpenChange={setOpenEditCategoryDialog}
    onSave={handleUpdateCategory}
    category={selectedCategory}
  /> */}
    </div>
  );
};
