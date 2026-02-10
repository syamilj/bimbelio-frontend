'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import {
  BookOpenIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  FileQuestionIcon,
  PlayIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TypeData } from './modul-types';

export const DetailContent = ({
  category,
  chapter,
  index,
}: {
  category: TypeData[0];
  chapter: TypeData[0]['CourseChapter'][0];
  index: number;
}) => {
  const router = useRouter();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const totalSubChapters = chapter.CourseSubChapter.length;
  const videoCount = chapter.CourseSubChapter.filter(
    (sub) => sub.video !== null,
  ).length;
  const quizCount = chapter.CourseSubChapter.filter(
    (sub) => sub.type === 'TRYOUT',
  ).length;
  const materiCount = chapter.CourseSubChapter.filter(
    (sub) => sub.materi !== null,
  ).length;
  const totalTime = chapter.CourseSubChapter.reduce(
    (acc, sub) => acc + sub.spendTime,
    0,
  );

  return (
    <div key={index}>
      {/* Header Chapter */}
      <div
        className="p-4 rounded-3xl border-2 border-gray-100 hover:border-gray-300 transition-all cursor-pointer group"
        onClick={() =>
          setExpandedChapter(expandedChapter === index ? null : index)
        }
      >
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-3xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: mainColor }}
          >
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm text-gray-900 group-hover:text-gray-700 flex-1">
                {chapter.title}
              </h4>
              {chapter.isDone && (
                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
              <ChevronDownIcon
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                  expandedChapter === index ? 'rotate-180' : ''
                }`}
              />
            </div>
            <p className="text-xs text-gray-500">
              {totalSubChapters} Sub Chapter
            </p>
          </div>
        </div>

        {/* Content Type Stats */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {videoCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-red-50 border border-red-200">
              <PlayIcon className="w-3 h-3 text-red-600" />
              <span className="text-xs font-semibold text-red-700">
                {videoCount}
              </span>
            </div>
          )}
          {materiCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-purple-50 border border-purple-200">
              <BookOpenIcon className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-semibold text-purple-700">
                {materiCount}
              </span>
            </div>
          )}
          {quizCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-green-50 border border-green-200">
              <FileQuestionIcon className="w-3 h-3 text-green-600" />
              <span className="text-xs font-semibold text-green-700">
                {quizCount}
              </span>
            </div>
          )}
          {totalTime > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-blue-50 border border-blue-200">
              <ClockIcon className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">
                {totalTime}m
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar per Chapter */}
        {chapter.isDone ? (
          <div className="flex items-center gap-2 text-xs font-medium text-green-600">
            <div className="flex-1 h-1.5 bg-green-500 rounded-full" />
            <span>100% Selesai</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
            <span>Belum Dimulai</span>
          </div>
        )}
      </div>

      {/* Sub Chapter List - Dropdown */}
      {expandedChapter === index && (
        <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
          {chapter.CourseSubChapter.map((subChapter) => (
            <div
              key={subChapter.id}
              className="p-3 rounded-3xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
              onClick={() => {
                router.push(
                  `/${website_sub_category_id_params}/user/bimcourse/${category.id}/study?sub=${subChapter.id}&tab=chat`,
                );
              }}
            >
              <div className="flex items-start gap-2">
                <div className="mt-1 flex-shrink-0">
                  {subChapter.type === 'TRYOUT' ? (
                    <FileQuestionIcon className="w-4 h-4 text-green-600" />
                  ) : subChapter.video ? (
                    <PlayIcon className="w-4 h-4 text-red-600" />
                  ) : subChapter.materi ? (
                    <BookOpenIcon className="w-4 h-4 text-purple-600" />
                  ) : (
                    <FileQuestionIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-gray-900">
                    {subChapter.number}. {subChapter.title}
                  </h5>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {subChapter.description}
                  </p>
                  {subChapter.spendTime > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <ClockIcon className="w-3 h-3" />
                      {subChapter.spendTime}m
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // return (
  //   <div
  //     key={index}
  //     className="p-4 rounded-3xl border-2 border-gray-100 hover:border-gray-300 transition-all cursor-pointer group"
  //     onClick={() => {
  //       if (chapter.CourseSubChapter.length > 0) {
  //         router.push(
  //           `/${website_sub_category_id_params}/user/bimcourse/${category.id}?sub=${chapter.CourseSubChapter[0].id}&tab=chat`,
  //         );
  //       }
  //     }}
  //   >
  //     {/* Header Chapter */}
  //     <div className="flex items-start gap-3 mb-3">
  //       <div
  //         className="w-10 h-10 rounded-3xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
  //         style={{ backgroundColor: mainColor }}
  //       >
  //         {index + 1}
  //       </div>
  //       <div className="flex-1 min-w-0">
  //         <div className="flex items-center gap-2 mb-1">
  //           <h4 className="font-bold text-sm text-gray-900 group-hover:text-gray-700">
  //             {chapter.title}
  //           </h4>
  //           {chapter.isDone && (
  //             <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
  //           )}
  //         </div>
  //         <p className="text-xs text-gray-500">
  //           {totalSubChapters} Sub Chapter
  //         </p>
  //       </div>
  //     </div>

  //     {/* Content Type Stats */}
  //     <div className="grid grid-cols-4 gap-2 mb-3">
  //       {videoCount > 0 && (
  //         <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-red-50 border border-red-200">
  //           <PlayIcon className="w-3 h-3 text-red-600" />
  //           <span className="text-xs font-semibold text-red-700">
  //             {videoCount}
  //           </span>
  //         </div>
  //       )}
  //       {materiCount > 0 && (
  //         <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-purple-50 border border-purple-200">
  //           <BookOpenIcon className="w-3 h-3 text-purple-600" />
  //           <span className="text-xs font-semibold text-purple-700">
  //             {materiCount}
  //           </span>
  //         </div>
  //       )}
  //       {quizCount > 0 && (
  //         <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-green-50 border border-green-200">
  //           <FileQuestionIcon className="w-3 h-3 text-green-600" />
  //           <span className="text-xs font-semibold text-green-700">
  //             {quizCount}
  //           </span>
  //         </div>
  //       )}
  //       {totalTime > 0 && (
  //         <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-blue-50 border border-blue-200">
  //           <ClockIcon className="w-3 h-3 text-blue-600" />
  //           <span className="text-xs font-semibold text-blue-700">
  //             {totalTime}m
  //           </span>
  //         </div>
  //       )}
  //     </div>

  //     {/* Progress Bar per Chapter */}
  //     {chapter.isDone ? (
  //       <div className="flex items-center gap-2 text-xs font-medium text-green-600">
  //         <div className="flex-1 h-1.5 bg-green-500 rounded-full" />
  //         <span>100% Selesai</span>
  //       </div>
  //     ) : (
  //       <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
  //         <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
  //         <span>Belum Dimulai</span>
  //       </div>
  //     )}
  //   </div>
  // );
};
