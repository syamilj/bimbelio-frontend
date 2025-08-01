import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { IconRegenerateMessage, IconTailedArrowNext } from '@/styles/icon';
import { useEffect, useState } from 'react';
import { useProvider } from '../provider';

export default function HeadingTools() {
  const {
    setShowAddDocument,
    filter,
    setFilter,
    setFilterDocument,
    filterDocument,
  } = useProvider();

  const [showFilter, setShowFilter] = useState<boolean>(false);

  // const { data: category } = api.category.getAllCategories.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const [category, setCategory] = useState<
    {
      name: string;
      id: string;
      total: number;
    }[]
  >([]);
  const fetchCategory = async () => {
    await getGeneral('/category/getAllCategories', {
      setData: setCategory,
    });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleFilter = () => {
    if (!filter) {
      // toaster({
      //   title: "Filter",
      //   condition: "warning",
      //   description: `Pilih Filter`,
      //   duration: 3000
      // })
      return;
    }
    if (filter?.value === '') {
      // toaster({
      //   title: "Filter",
      //   condition: "warning",
      //   description: `Pilih ${filter.filter}`,
      //   duration: 3000
      // })
      return;
    }
    if (filter) {
      setFilterDocument({ filter: filter.filter, filterValue: filter.value });
      setShowFilter(false);
    }
  };

  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-4">
        {showFilter && (
          <div
            className="fixed left-0 top-0 z-1 h-full w-full"
            onClick={() => setShowFilter(false)}
          />
        )}
        <div className="">
          <input
            type="text"
            placeholder="Cari document...."
            className="h-full w-full rounded-[.7rem] bg-white px-4 outline-none"
          />
        </div>
        <div className="relative">
          <div
            className={cn(
              'font-regular relative z-2 flex cursor-pointer items-center rounded-[.7rem] bg-white px-4 py-[.5rem] text-main-gray-text2',
              filterDocument?.filter &&
                filterDocument?.filterValue !== '' &&
                'bg-main text-white',
            )}
            onClick={() => setShowFilter(!showFilter)}
          >
            <i className="bx bx-filter text-[1.5rem]" />
            {filterDocument?.filter ? 'Filtered' : 'Filter'}
          </div>
          {showFilter && (
            <div className="absolute left-[0] top-[calc(100%+.5rem)] z-2 flex min-w-[280px] flex-col whitespace-nowrap rounded-[.5rem] bg-white p-[.5rem] text-[.8rem] text-main-gray-text shadow-cardSoft">
              <div className="flex items-center justify-between gap-[.5rem]">
                <Select
                  value={filter?.filter}
                  onValueChange={(value) =>
                    value &&
                    setFilter({ type: 'option', filter: value, value: '' })
                  }
                >
                  <SelectTrigger className="h-[30px] rounded-[.4rem] py-0">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <IconTailedArrowNext
                  w={10}
                  className="shrink-0"
                />
                {filter?.type === 'input' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter value"
                      className="h-[30px] rounded-[.4rem] border px-[12px] outline-none"
                    />
                  </div>
                )}
                {filter?.type === 'option' && (
                  <Select
                    value={filter.value}
                    onValueChange={(value) =>
                      value &&
                      setFilter((prev) => {
                        if (prev) {
                          return { ...prev, value: value };
                        } else {
                          return null;
                        }
                      })
                    }
                  >
                    <SelectTrigger className="h-[30px] rounded-[.4rem] py-0">
                      <SelectValue placeholder={`Pilih ${filter.filter}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.filter === 'category' &&
                        category?.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={`${item.id}`}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      {filter.filter === 'status' && (
                        <>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="free">Free</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <hr className="my-[.5rem]" />
              <div className="flex items-center justify-between gap-8">
                <div
                  className="flex cursor-pointer items-center justify-center gap-[.5rem] rounded-[.3rem] px-[.5rem] py-[.2rem] duration-300 active:bg-white md:hover:bg-main-gray-input"
                  onClick={() => {
                    setFilterDocument(null);
                  }}
                >
                  <IconRegenerateMessage w={10} />
                  <p>Clear</p>
                </div>
                <div
                  className={cn(
                    'flex cursor-pointer items-center justify-center gap-[.5rem] rounded-[.3rem] border px-[.5rem] py-[.2rem] duration-300 active:bg-white md:hover:bg-main-gray-input',
                    !filter &&
                      'cursor-default bg-white text-main-gray-disabled md:hover:bg-white',
                    filter?.value === '' &&
                      'cursor-default bg-white text-main-gray-disabled md:hover:bg-white',
                  )}
                  onClick={handleFilter}
                >
                  <p>Apply filter</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div
          className="cursor-pointer rounded-[.7rem] bg-transparent px-6 py-[.7rem] font-medium text-main-gray-text duration-200"
          onClick={() => setShowAddDocument(true)}
        >
          Export CSV
        </div>
        <div
          className="font-regular cursor-pointer rounded-[.7rem] bg-main px-6 py-[.7rem] text-white duration-200 hover:bg-main-hover"
          onClick={() => setShowAddDocument(true)}
        >
          Tambah dokumen
        </div>
      </div>
    </div>
  );
}
