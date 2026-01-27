'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { ModalVerification } from '@/components/ui/modal-verification';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { QuizVolume, Tryout, TryoutSession } from '@/types/database';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Edit,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLIC':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'PRIVATE':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'DRAFT':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export default function QuizVolumePage() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [expandedVolumes, setExpandedVolumes] = useState<Set<string>>(
    new Set(),
  );

  const { data: QuizVolumeData, refetch } = useGet<
    (QuizVolume & {
      TryoutCategory: {
        id: string;
        name: string;
        TryoutSubCategory: {
          id: string;
          name: string;
          Tryout: (Tryout & {
            TryoutSession: TryoutSession;
          })[];
        }[];
      }[];
    })[]
  >('/quizTryout/getQuizVolume');

  const { isLoading: isDeleting, mutate: deleteQuizVolume } = useMutation(
    '/quizTryout/deleteQuizVolume',
    'delete',
    {
      async onSuccess() {
        await refetch();
      },
    },
  );

  const toggleExpanded = (volumeId: string) => {
    const newSet = new Set(expandedVolumes);
    if (newSet.has(volumeId)) {
      newSet.delete(volumeId);
    } else {
      newSet.add(volumeId);
    }
    setExpandedVolumes(newSet);
  };

  const volumes = QuizVolumeData || [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Title & Action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                  Quiz Volume Management
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Kelola semua volume quiz di sini
                </p>
              </div>
            </div>
          </div>
          <Link
            href="./quiz-volume/new"
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-3.5 text-white font-bold text-sm md:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Plus className="w-5 h-5" />
            Create Volume
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
          <div
            className="rounded-2xl border-2 p-4 md:p-5"
            style={{
              background: `${mainColor}08`,
              borderColor: `${mainColor}20`,
            }}
          >
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Volumes
            </p>
            <p
              className="text-2xl md:text-3xl font-black mt-2"
              style={{ color: mainColor }}
            >
              {volumes.length}
            </p>
          </div>
          <div
            className="rounded-2xl border-2 p-4 md:p-5"
            style={{
              background: `${mainColor}08`,
              borderColor: `${mainColor}20`,
            }}
          >
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wide">
              Public
            </p>
            <p className="text-2xl md:text-3xl font-black mt-2 text-emerald-600">
              {volumes.filter((v) => v.status === 'PUBLIC').length}
            </p>
          </div>
          <div
            className="rounded-2xl border-2 p-4 md:p-5"
            style={{
              background: `${mainColor}08`,
              borderColor: `${mainColor}20`,
            }}
          >
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wide">
              Drafts
            </p>
            <p className="text-2xl md:text-3xl font-black mt-2 text-amber-600">
              {volumes.filter((v) => v.status === 'DRAFT').length}
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow
                  className="border-b-2"
                  style={{ borderColor: `${mainColor}15` }}
                >
                  <TableHead className="w-12 text-center font-bold text-slate-700">
                    Expand
                  </TableHead>
                  <TableHead className="w-12 text-center font-bold text-slate-700">
                    No
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Volume
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Created At
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Updated At
                  </TableHead>
                  <TableHead className="text-center font-bold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="w-24 text-center font-bold text-slate-700">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volumes.map((volume, index) => (
                  <>
                    <TableRow
                      key={volume.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="text-center">
                        <button
                          onClick={() => toggleExpanded(volume.id)}
                          className="inline-flex items-center justify-center p-1 rounded-md hover:bg-slate-200 transition-colors"
                        >
                          {expandedVolumes.has(volume.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-400">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-slate-900">
                            Volume {volume.number}
                          </p>
                          <p className="text-sm text-slate-500">
                            {volume.title}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(volume.createdAt)}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(volume.updatedAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border',
                            getStatusColor(volume.status),
                          )}
                        >
                          {volume.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`./quiz-volume/${volume.id}`}
                            className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            style={{ color: mainColor }}
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <ModalVerification
                            onClick={() => {
                              deleteQuizVolume({ params: { id: volume.id } });
                            }}
                            isLoading={isDeleting}
                            title="Delete Quiz Volume"
                            description={`Are you sure you want to delete Volume ${volume.number} - "${volume.title}"? This action cannot be undone.`}
                            type="delete"
                          >
                            <button className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </ModalVerification>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row - TryoutCategory */}
                    {expandedVolumes.has(volume.id) &&
                      volume.TryoutCategory && (
                        <TableRow className="bg-slate-50/50 border-b border-slate-100">
                          <TableCell
                            colSpan={7}
                            className="p-0"
                          >
                            <div className="p-4 space-y-4">
                              {volume.TryoutCategory.length > 0 ? (
                                volume.TryoutCategory.map((category) => (
                                  <div
                                    key={category.id}
                                    className="border border-slate-200 rounded-lg p-4 bg-white"
                                  >
                                    <h4 className="font-bold text-slate-900 mb-3">
                                      {category.name}
                                    </h4>

                                    {/* TryoutSubCategory */}
                                    <div className="space-y-2 ml-4">
                                      {category.TryoutSubCategory.map(
                                        (subCategory) => (
                                          <div
                                            key={subCategory.id}
                                            className="border-l-2 border-slate-200 pl-4 py-2"
                                          >
                                            <p className="font-semibold text-slate-800 text-sm">
                                              {subCategory.name}
                                            </p>

                                            {/* Tryout & Session */}
                                            <div className="mt-2 space-y-1 flex flex-wrap gap-4">
                                              {subCategory.Tryout.map(
                                                (tryout) => (
                                                  <div
                                                    key={tryout.id}
                                                    className="text-xs bg-slate-100 rounded p-2 w-fit"
                                                  >
                                                    <p className="font-medium text-slate-700">
                                                      {tryout.title}
                                                    </p>
                                                    <div className="text-slate-600 mt-1 space-y-0.5">
                                                      <p>
                                                        Duration:{' '}
                                                        {
                                                          tryout.TryoutSession
                                                            .duration
                                                        }{' '}
                                                        mins
                                                      </p>
                                                      <p>
                                                        Session:{' '}
                                                        {
                                                          tryout.TryoutSession
                                                            .name
                                                        }
                                                      </p>
                                                      <p>
                                                        Status:{' '}
                                                        <span
                                                          className={cn(
                                                            'inline-block px-2 py-0.5 rounded text-xs font-semibold',
                                                            tryout.status ===
                                                              'PUBLIC'
                                                              ? 'bg-emerald-100 text-emerald-700'
                                                              : tryout.status ===
                                                                  'DRAFT'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-slate-200 text-slate-700',
                                                          )}
                                                        >
                                                          {tryout.status}
                                                        </span>
                                                      </p>
                                                    </div>
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-500">
                                  No categories available
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {volumes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: `${mainColor}10` }}
              >
                <BookOpen
                  className="w-8 h-8"
                  style={{ color: mainColor }}
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                No Volumes Yet
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Create your first quiz volume to get started
              </p>
              <Link
                href="./quiz-volume/new"
                className="flex items-center gap-2 px-4 py-2 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                Create Volume <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
