'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { Category } from '@/types/database';
import {
  BookOpen,
  ChevronRightIcon,
  Clock,
  Edit,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const { data: category, isLoading: isCategoryLoading } = useGet<Category[]>(
    '/category/getAllCategoryAdminCourse',
  );

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: courses, isLoading: isCoursesLoading } = useGet(
    '/course/getCourseByCategoryId',
    {
      params: { categoryId },
      useEffectDependencies: [categoryId],
    },
  );

  useEffect(() => {
    if (category && category.length > 0 && !categoryId) {
      setCategoryId(category[0].id);
    }
  }, [category, categoryId]);

  const filteredCourses = courses?.filter((course: Course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Simple Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kursus</h1>
            <p className="text-gray-500 text-sm">
              Kelola semua kursus pembelajaran
            </p>
          </div>
          <Button
            asChild
            className="gap-2"
          >
            <Link href={`/${website_sub_category_id}/admin/course/new`}>
              <Plus className="h-4 w-4" />
              Buat Kursus
            </Link>
          </Button>
        </div>

        {/* Simple Category Filter */}
        {!isCategoryLoading && category ? (
          <Tabs
            value={categoryId || ''}
            onValueChange={setCategoryId}
          >
            <TabsList className="h-9 bg-white border border-gray-200">
              {category.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <Skeleton className="h-9 w-96" />
        )}

        {/* Simple Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kursus..."
            className="pl-10"
          />
        </div>

        {/* Simple Course Grid */}
        <div className="grid gap-4 md:gap-6">
          {isCoursesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-32 w-full rounded-lg"
              />
            ))
          ) : filteredCourses?.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'Tidak ditemukan' : 'Belum ada kursus'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? 'Coba kata kunci lain'
                  : 'Buat kursus pertama Anda'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href={`/${website_sub_category_id}/admin/course/new`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Kursus Baru
                  </Link>
                </Button>
              )}
            </Card>
          ) : (
            filteredCourses?.map((course: Course) => (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">
                            {course.number}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        <Badge
                          variant={
                            course.status === 'PUBLIC' ? 'default' : 'secondary'
                          }
                          className={cn(
                            course.status === 'PUBLIC'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700',
                          )}
                        >
                          {course.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course._count.CourseSubChapter} materi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.Category.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link
                          href={`/${website_sub_category_id}/admin/course/edit/${course.id}`}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Sub Chapters Preview */}
                  {course.CourseSubChapter.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 overflow-x-auto">
                        {course.CourseSubChapter.slice(0, 3).map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap"
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>{sub.title}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{sub.spendTime}m</span>
                            </div>
                          </div>
                        ))}
                        {course.CourseSubChapter.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{course.CourseSubChapter.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Simple Stats */}
        {filteredCourses && filteredCourses.length > 0 && (
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            {filteredCourses.length} kursus ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
