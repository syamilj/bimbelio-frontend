'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SpinnerCentered } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Category } from '@/types/database';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface SubChapter {
  id: string;
  number: number;
  title: string;
  spendTime: number;
  type: 'VIDEO' | 'DOCUMENT' | 'TRYOUT' | 'MATERI';
  description: string;
  premium: boolean;
}

interface Course {
  id: string;
  number: number;
  title: string;
  status: 'PRIVATE' | 'PUBLIC';
  categoryId: string;
  _count: {
    CourseSubChapter: number;
  };
  Category: {
    name: string;
  };
  CourseSubChapter: SubChapter[];
}

export default function Index() {
  // const { data: category, isLoading: isCategoryLoading } =
  //   api.category.getAllCategoryAdminCourse.useQuery(undefined, {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   });

  const { data: category, isLoading: isCategoryLoading } = useGet<Category[]>(
    '/category/getAllCategoryAdminCourse',
  );

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // const { data: courses, isLoading: isCoursesLoading } =
  //   api.course.getCourseByCategoryId.useQuery(
  //     { categoryId },
  //     { refetchOnWindowFocus: false, enabled: !!categoryId },
  //   );

  const { data: courses, isLoading: isCoursesLoading } = useGet(
    '/course/getCourseByCategoryId',
    {
      params: { categoryId },
      useEffectDependencies: [categoryId],
    },
  );

  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  useEffect(() => {
    if (category && category.length > 0 && !categoryId) {
      setCategoryId(category[0].id);
    }
  }, [category, categoryId]);

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  return (
    <div className="px-6 py-4 space-y-6">
      <ScrollArea className="w-full">
        <Tabs
          value={categoryId || 'placeholder'}
          onValueChange={setCategoryId}
        >
          <TabsList className="h-9 w-full justify-start p-0 gap-2">
            {category?.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="rounded-full"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <ScrollBar
          orientation="horizontal"
          className="invisible"
        />
      </ScrollArea>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kursus..."
              className="pl-9 w-[300px]"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
          >
            <FileIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            size="sm"
            asChild
          >
            <Link href={`/${website_sub_category_id}/admin/course/new`}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Tambah Kursus
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b transition-colors">
              <th className="h-12 px-4 text-center w-[48px]"></th>
              <th className="h-12 px-4 text-left text-sm font-medium">No</th>
              <th className="h-12 px-4 text-left text-sm font-medium">Judul</th>
              <th className="h-12 px-4 text-left text-sm font-medium">
                Status
              </th>
              <th className="h-12 px-4 text-left text-sm font-medium">
                Sub Chapter
              </th>
              <th className="h-12 px-4 text-left text-sm font-medium">
                Kategori
              </th>
              <th className="h-12 px-4 text-right text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {courses?.map((course: Course) => (
              <React.Fragment key={course.id}>
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleCourseExpansion(course.id)}
                    >
                      {expandedCourses.includes(course.id) ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </td>
                  <td className="p-4">{course.number}</td>
                  <td className="p-4 font-medium">{course.title}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        course.status === 'PUBLIC' ? 'default' : 'secondary'
                      }
                    >
                      {course.status}
                    </Badge>
                  </td>
                  <td className="p-4">{course._count.CourseSubChapter}</td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className="rounded-full"
                    >
                      {course.Category.name}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="link"
                      className="text-primary"
                      asChild
                    >
                      <Link
                        href={`/${website_sub_category_id}/admin/course/edit/${course.id}`}
                      >
                        Edit
                      </Link>
                    </Button>
                  </td>
                </tr>
                {expandedCourses.includes(course.id) &&
                  course.CourseSubChapter.map((subChapter) => (
                    <tr
                      key={subChapter.id}
                      className="border-b bg-muted/50"
                    >
                      {/* <td className="p-4 text-center">
                        <DotIcon className="h-4 w-4 inline-block" />
                      </td> */}
                      <td className="p-4">
                        {' '}
                        {/* {course.number}.{subChapter.number} */}
                      </td>
                      <td className="p-4">
                        {' '}
                        {/* {course.number}.{subChapter.number} */}
                      </td>
                      <td
                        className="p-4"
                        colSpan={5}
                      >
                        <span className="font-medium">{subChapter.title}</span>
                        <span className="text-muted-foreground">
                          {' '}
                          - {subChapter.type} - {subChapter.spendTime} menit
                        </span>
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {(isCategoryLoading || isCoursesLoading) && (
          <div className="text-center py-4">
            <SpinnerCentered />
          </div>
        )}
      </div>
    </div>
  );
}
