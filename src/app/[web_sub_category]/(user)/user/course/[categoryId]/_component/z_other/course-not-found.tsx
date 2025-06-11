import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { BookOpen, MessageCircle, Trophy } from 'lucide-react';
import Link from 'next/link';
import HeaderCourse from './header';

export default function CourseNotFound() {
  return (
    <div className="flex-1 flex flex-col absolute top-0 left-0 w-full h-full md:pl-[75px] overflow-y-auto">
      <HeaderCourse className="flex md:hidden" />
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Belajar</h1>
            <p className="text-gray-600 mt-1">Mulai perjalanan belajar Anda</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Course ini tidak ditemukan
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Anda belum memiliki course apapun. Mulai belajar dengan
                menambahkan course pertama Anda.
              </p>
              <div className="flex gap-3">
                <Link href={`/${website_sub_category_id_params}/user/course`}>
                  <Button className="bg-main hover:opacity-90">
                    Jelajahi Course
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Materi Pembelajaran
                </h3>
                <p className="text-sm text-gray-600">
                  Akses berbagai materi pembelajaran yang tersedia
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Try Out</h3>
                <p className="text-sm text-gray-600">
                  Uji kemampuan dengan berbagai latihan soal
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  AI Assistant
                </h3>
                <p className="text-sm text-gray-600">
                  Dapatkan bantuan dari asisten AI
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
