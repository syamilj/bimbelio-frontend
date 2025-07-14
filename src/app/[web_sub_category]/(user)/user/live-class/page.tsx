'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  MockLiveClass,
  mockLiveClasses,
  mockLiveClassParticipants,
} from '@/lib/mock-data/live-class';
import {
  Category,
  Instructor,
  LiveClass,
  LiveClassAgenda,
  LiveClassReference,
} from '@/types/database';
import { BookOpen, Search, Star, Video } from 'lucide-react';
import { useState } from 'react';
import { JoinLiveClassModal } from './_components/join-live-class-modal';
import { LiveClassAvailable } from './_components/live-class-available';
import { LiveClassNotifications } from './_components/live-class-notifications';
import { LiveClassUser } from './_components/live-class-user';
import { RatingModal } from './_components/rating-modal';
import { RegisterLiveClassModal } from './_components/register-live-class-modal';
import { UpcomingLiveClasses } from './_components/upcoming-live-classes';

interface StudentEnrollment {
  liveClassId: string;
  enrolledAt: Date;
  status: 'enrolled' | 'completed' | 'missed';
  rating?: number;
  review?: string;
}

// Mock user ID dan email untuk demo
const CURRENT_USER_ID = 'user2'; // Changed to user2 untuk demo yang lebih baik
const CURRENT_USER_EMAIL = 'siti.nurhaliza@student.bimbelio.com'; // Mock email from user login

// Helper function untuk get participant status
const getParticipantStatus = (
  liveClassId: string,
  userId: string = CURRENT_USER_ID,
) => {
  const participant = mockLiveClassParticipants.find(
    (p) => p.liveClassId === liveClassId && p.userId === userId,
  );
  return participant?.status || null;
};

// Helper function untuk check if user has registered
const isUserRegistered = (
  liveClassId: string,
  userId: string = CURRENT_USER_ID,
) => {
  return mockLiveClassParticipants.some(
    (p) => p.liveClassId === liveClassId && p.userId === userId,
  );
};

// Mock data untuk enrollment student (akan diganti dengan participant data)
const mockStudentEnrollments: StudentEnrollment[] = [
  {
    liveClassId: '1',
    enrolledAt: new Date('2025-01-10T10:00:00'),
    status: 'enrolled',
  },
  {
    liveClassId: '2',
    enrolledAt: new Date('2025-01-11T09:00:00'),
    status: 'enrolled',
  },
  {
    liveClassId: '4',
    enrolledAt: new Date('2025-01-08T14:00:00'),
    status: 'completed',
    rating: 5,
    review: 'Penjelasan sangat detail dan mudah dipahami!',
  },
];

type LiveClassAvailableType = LiveClass & {
  Instructor: Instructor;
  Category: Category;
  LiveClassReference: LiveClassReference[];
  LiveClassAgenda: LiveClassAgenda[];
  endDate: string;
  status: string;
};

export default function LiveClassStudentDashboard() {
  const {
    data: LiveClassAvailableData,
    isLoading: LiveClassAvailableDataIsLoading,
  } = useGet<LiveClassAvailableType[]>('/liveClass/getAllLiveClassAvailable', {
    params: { take: 100, page: 1 },
  });

  const { data: Categories } = useGet<Category[]>('/category/getAllCategories');

  // ============================
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    liveClass: MockLiveClass | null;
  }>({ isOpen: false, liveClass: null });
  const [registerModal, setRegisterModal] = useState<{
    isOpen: boolean;
    liveClass: MockLiveClass | null;
  }>({ isOpen: false, liveClass: null });
  const [joinModal, setJoinModal] = useState<{
    isOpen: boolean;
    liveClass: MockLiveClass | null;
  }>({ isOpen: false, liveClass: null });

  // Get enrolled live classes - berdasarkan participant data
  const enrolledLiveClassIds = mockLiveClassParticipants
    .filter((p) => p.userId === CURRENT_USER_ID)
    .map((p) => p.liveClassId);
  const enrolledLiveClasses = mockLiveClasses.filter((lc) =>
    enrolledLiveClassIds.includes(lc.id),
  );

  // Filter functions
  const filterLiveClasses = (classes: LiveClassAvailableType[]) => {
    return classes.filter((liveClass) => {
      const matchesSearch =
        liveClass.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        liveClass.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        liveClass.Instructor.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesSubject =
        selectedSubject === 'all' || liveClass.categoryId === selectedSubject;
      const matchesStatus =
        selectedStatus === 'all' || liveClass.status === selectedStatus;

      return matchesSearch && matchesSubject && matchesStatus;
    });
  };

  const filteredAvailable = filterLiveClasses(LiveClassAvailableData || []);
  const filteredUser = filterLiveClasses(LiveClassAvailableData || []);

  const handleRatingSubmit = async (rating: number, review: string) => {
    if (!ratingModal.liveClass) return;

    // TODO: Implement actual API call to submit rating
    console.log('Submitting rating:', {
      liveClassId: ratingModal.liveClass.id,
      rating,
      review,
    });

    // For now, just show success message
    alert(`Rating ${rating} bintang berhasil dikirim!`);

    // Update local mock data (in real app, this would be handled by API response)
    const existingEnrollment = mockStudentEnrollments.find(
      (e) => e.liveClassId === ratingModal.liveClass!.id,
    );
    if (existingEnrollment) {
      existingEnrollment.rating = rating;
      existingEnrollment.review = review;
    }
  };

  const openRatingModal = (liveClass: MockLiveClass) => {
    setRatingModal({ isOpen: true, liveClass });
  };

  const closeRatingModal = () => {
    setRatingModal({ isOpen: false, liveClass: null });
  };

  const closeRegisterModal = () => {
    setRegisterModal({ isOpen: false, liveClass: null });
  };

  const closeJoinModal = () => {
    setJoinModal({ isOpen: false, liveClass: null });
  };

  const handleRegisterSuccess = (email: string) => {
    // Modal akan otomatis close, dan kita bisa refresh atau update state
    setRegisterModal({ isOpen: false, liveClass: null });
    console.log('User registered with email:', email);
    // Dalam implementasi nyata, ini akan trigger refresh data
  };

  const handleJoinSuccess = (email: string) => {
    // Modal akan otomatis close setelah redirect
    setJoinModal({ isOpen: false, liveClass: null });
    console.log('User joined with email:', email);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Class</h1>
          <p className="text-muted-foreground">
            Ikuti kelas langsung dengan tutor ahli
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LiveClassNotifications />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kelas Diikuti</p>
                <p className="text-2xl font-bold">
                  {enrolledLiveClasses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kelas Selesai</p>
                <p className="text-2xl font-bold">
                  {
                    mockStudentEnrollments.filter(
                      (e) => e.status === 'completed',
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Rating Rata-rata
                </p>
                <p className="text-2xl font-bold">
                  {mockStudentEnrollments
                    .filter((e) => e.rating)
                    .reduce((acc, e) => acc + (e.rating || 0), 0) /
                    mockStudentEnrollments.filter((e) => e.rating).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-1">
          <UpcomingLiveClasses data={LiveClassAvailableData || []} />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari kelas, tutor, atau mata pelajaran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                {Categories?.map((subject) => (
                  <SelectItem
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
                <SelectItem value="ONGOING">Berlangsung</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">
            Kelas Tersedia ({filteredAvailable.length})
          </TabsTrigger>
          <TabsTrigger value="enrolled">
            Kelas Saya ({filteredUser.length})
          </TabsTrigger>
        </TabsList>

        <LiveClassAvailable
          filteredAvailable={filteredAvailable}
          isLoading={LiveClassAvailableDataIsLoading}
        />

        {/* Enrolled Classes Tab */}
        <LiveClassUser filteredUser={filteredUser} />
      </Tabs>

      {/* Rating Modal */}
      {ratingModal.liveClass && (
        <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={closeRatingModal}
          liveClass={ratingModal.liveClass}
          onSubmit={handleRatingSubmit}
        />
      )}

      {/* Register Modal */}
      {registerModal.liveClass && (
        <RegisterLiveClassModal
          isOpen={registerModal.isOpen}
          onClose={closeRegisterModal}
          liveClass={registerModal.liveClass}
          userEmail={CURRENT_USER_EMAIL}
          onRegister={handleRegisterSuccess}
        />
      )}

      {/* Join Modal */}
      {joinModal.liveClass && (
        <JoinLiveClassModal
          isOpen={joinModal.isOpen}
          onClose={closeJoinModal}
          liveClass={joinModal.liveClass}
          userEmail={CURRENT_USER_EMAIL}
          onJoin={handleJoinSuccess}
        />
      )}
    </div>
  );
}
