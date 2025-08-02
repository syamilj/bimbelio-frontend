import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { formatDateTime, formatDuration } from '@/lib/utils';
import { BookOpen, Calendar, Clock, Loader2, Users, Video } from 'lucide-react';
import Link from 'next/link';
import { LiveClassAvailableType } from '../_type';

export const LiveClassAvailable = ({
  filteredAvailable,
  isLoading,
}: {
  isLoading: boolean;
  filteredAvailable: LiveClassAvailableType[];
}) => {
  return (
    <TabsContent
      value="available"
      className="space-y-4"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Loader2 className="animate-spin w-12 h-12 text-main" />
        </div>
      ) : filteredAvailable.length > 0 ? (
        <div className="grid gap-4">
          {filteredAvailable.map((liveClass) => {
            const referenceCourse = liveClass.LiveClassReference.filter(
              (item) => item.type === 'COURSE',
            );
            const referenceUrl = liveClass.LiveClassReference.filter(
              (item) => item.type === 'URL',
            );
            return (
              <Card
                key={liveClass.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">
                            {liveClass.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {liveClass.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDateTime(new Date(liveClass.startDate))}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(liveClass.duration)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />-
                              {liveClass.maxParticipant &&
                                `/${liveClass.maxParticipant}`}{' '}
                              peserta
                            </div>
                          </div>
                        </div>

                        <Badge className={getStatusColor(liveClass.status)}>
                          {liveClass.status}
                        </Badge>
                      </div>

                      {/* Tutor Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={liveClass.Instructor.image || undefined}
                          />
                          <AvatarFallback>
                            {liveClass.Instructor.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {liveClass.Instructor.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {liveClass.Category.name}
                          </p>
                        </div>
                      </div>

                      {/* References Preview */}
                      {(liveClass.LiveClassReference.length > 0 ||
                        liveClass.LiveClassReference.length > 0) && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">
                            Materi Referensi:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {referenceCourse.slice(0, 2).map((ref) => (
                              <Badge
                                key={ref.id}
                                variant="outline"
                                className="text-xs"
                              >
                                <BookOpen className="h-3 w-3 mr-1" />
                                {ref.title}
                              </Badge>
                            ))}
                            {referenceUrl.slice(0, 2).map((ref) => (
                              <Badge
                                key={ref.id}
                                variant="outline"
                                className="text-xs"
                              >
                                <Video className="h-3 w-3 mr-1" />
                                {ref.title}
                              </Badge>
                            ))}
                            {referenceCourse.length + referenceUrl.length >
                              4 && (
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                +
                                {referenceCourse.length +
                                  referenceUrl.length -
                                  4}{' '}
                                lainnya
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      {/* {canEnroll(liveClass) && (
                        <Button
                          onClick={() => handleEnroll(liveClass)}
                          className="w-full"
                        >
                          Daftar Kelas
                        </Button>
                      )}

                      {isUserRegistered(liveClass.id) && (
                        <Button
                          disabled
                          className="w-full"
                        >
                          Sudah Terdaftar
                        </Button>
                      )}

                      {!canEnroll(liveClass) &&
                        !isUserRegistered(liveClass.id) &&
                        liveClass.status === 'SCHEDULED' && (
                          <Button
                            disabled
                            className="w-full"
                          >
                            Kelas Penuh
                          </Button>
                        )} */}

                      <Button
                        variant="outline"
                        className="w-full"
                      >
                        <Link
                          href={`/${website_sub_category_id_params}/user/live-class/${liveClass.id}`}
                        >
                          Lihat Detail
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">
              Tidak ada kelas tersedia
            </h3>
            <p className="text-gray-500">
              Coba ubah filter pencarian atau kembali lagi nanti
            </p>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Sedang Berlangsung':
      return 'bg-blue-100 text-blue-800';
    case 'Akan Datang':
      return 'bg-green-100 text-green-800';
    case 'Selesai':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
