import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { formatDateTime, formatDuration } from '@/lib/utils';
import { Calendar, Clock, Video } from 'lucide-react';
import Link from 'next/link';
import { LiveClassAvailableType } from '../_type';

export const LiveClassUser = ({
  filteredUser,
}: {
  filteredUser: LiveClassAvailableType[];
}) => {
  return (
    <TabsContent
      value="enrolled"
      className="space-y-4"
    >
      {filteredUser.length > 0 ? (
        <div className="grid gap-4">
          {filteredUser.map((liveClass) => {
            // const enrollment = getEnrollmentInfo(liveClass.id);
            // const participant = getParticipantInfo(liveClass.id);
            return (
              <Card
                key={liveClass.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
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
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Badge className={getStatusColor(liveClass.status)}>
                            {liveClass.status}
                          </Badge>
                          {/* {participant && (
                            <Badge variant="outline">
                              {participant.status === 'registered' &&
                                'Terdaftar'}
                              {participant.status === 'invited' && 'Diundang'}
                              {participant.status === 'expired' &&
                                'Kedaluwarsa'}
                            </Badge>
                          )} */}
                        </div>
                      </div>

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

                      {/* {enrollment?.rating && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < enrollment.rating!
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              Rating Anda
                            </span>
                          </div>
                          {enrollment.review && (
                            <p className="text-sm text-gray-600">
                              "{enrollment.review}"
                            </p>
                          )}
                        </div>
                      )} */}
                    </div>

                    <div className="flex flex-col gap-3 lg:w-48">
                      {/* {canJoinClass(liveClass) && (
                        <Button
                          onClick={() => handleJoinClass(liveClass)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Join Kelas
                        </Button>
                      )}

                      {participant?.status === 'registered' &&
                        liveClass.status === 'SCHEDULED' && (
                          <Button
                            disabled
                            className="w-full"
                          >
                            Menunggu Undangan
                          </Button>
                        )} */}

                      <Button
                        variant="outline"
                        className="w-full"
                      >
                        <Link
                          href={`/${website_sub_category_id_params}/user/live-class/${liveClass.id}`}
                        >
                          Lihat Materi
                        </Link>
                      </Button>
                      {/* 
                      {liveClass.status === 'COMPLETED' &&
                        !enrollment?.rating && (
                          <Button
                            variant="outline"
                            className="w-full"
                            // onClick={() => openRatingModal(liveClass)}
                          >
                            Beri Rating
                          </Button>
                        )} */}
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
            <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">
              Belum ada kelas yang diikuti
            </h3>
            <p className="text-gray-500 mb-4">
              Daftar ke kelas yang tersedia untuk mulai belajar
            </p>
            {/* <Button onClick={() => setActiveTab('available')}>
              Lihat Kelas Tersedia
            </Button> */}
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
