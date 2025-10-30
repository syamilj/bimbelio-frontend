'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  MessageCircle,
  PlayCircle,
  Radio,
  Tv,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function LiveLearningPage() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* HEADER SECTION */}
        <div className="text-center mb-12 md:mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <div className="relative z-10">
              <CardTitle
                className="text-3xl font-bold flex items-center gap-4"
                style={{ color: mainColor }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <PlayCircle
                    className="w-6 h-6"
                    style={{ color: mainColor }}
                  />
                </div>
                Live Learning Dashboard
              </CardTitle>
              <CardDescription className="text-lg mt-3 text-gray-600">
                Ikuti kelas langsung dengan tutor ahli dan tingkatkan persiapan
                ujian Kamu
              </CardDescription>
            </div>
            {/* DECORATIVE ELEMENTS */}
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full opacity-5"
              style={{ backgroundColor: secondaryColor }}
            />
          </CardHeader>
          {/* STATS CARDS - LEADERBOARD PATTERN */}
          <CardContent className="p-6">
            {/* <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Kelas"
                value={liveClasses.length}
                description="Kelas tersedia untuk Kamu"
                icon={BookOpen}
                gradient="from-blue-500 to-blue-600"
                bgColor="bg-blue-50"
                borderColor="border-blue-200"
                textColor="text-blue-700"
              />
              <StatsCard
                title="Diundang"
                value={invitedClasses.length}
                description="Siap untuk diikuti"
                icon={Video}
                gradient="from-green-500 to-green-600"
                bgColor="bg-green-50"
                borderColor="border-green-200"
                textColor="text-green-700"
              />
              <StatsCard
                title="Terdaftar"
                value={registeredClasses.length}
                description="Menunggu undangan"
                icon={Users}
                gradient="from-yellow-500 to-yellow-600"
                bgColor="bg-yellow-50"
                borderColor="border-yellow-200"
                textColor="text-yellow-700"
              />
              <StatsCard
                title="Live Now"
                value={
                  liveClasses.filter((lc) => lc.status === 'Sedang Berlangsung')
                    .length
                }
                description="Sedang berlangsung"
                icon={Zap}
                gradient="from-red-500 to-red-600"
                bgColor="bg-red-50"
                borderColor="border-red-200"
                textColor="text-red-700"
              />
            </div> */}
            {/* Quick Actions for Upcoming Classes */}
            <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Kelas Mendatang
                </h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {LiveClassAvailable?.map((liveClass) => (
                  <UpcomingCard liveClass={liveClass} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari berdasarkan judul, deskripsi, atau nama tutor..."
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
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Pilih mata pelajaran" />
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
                  <SelectTrigger className="w-full sm:w-[150px]">
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

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Tampilan:
                    </span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                          viewMode === 'list'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="hidden sm:inline">List</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                          viewMode === 'grid'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span className="hidden sm:inline">Grid</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                          viewMode === 'calendar'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="hidden sm:inline">Calendar</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Urutkan:
                    </span>
                    <Select
                      value={sortBy}
                      onValueChange={(value: 'date' | 'name' | 'status') =>
                        setSortBy(value)
                      }
                    >
                      <SelectTrigger className="w-[120px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Tanggal</SelectItem>
                        <SelectItem value="name">Nama</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() =>
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      }
                      className="p-2 h-9 border rounded-md hover:bg-gray-50 transition-colors"
                      title={`Urutan: ${sortOrder === 'asc' ? 'Naik' : 'Turun'}`}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div> */}
                </div>
                {/* <div className="hidden lg:flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bell className="w-4 h-4" />
                    <span>{'-'} upcoming</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{'-'} registered</span>
                  </div>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 mb-6 md:mb-8 bg-gray-50 rounded-xl p-1 h-11 md:h-12 border-0">
            <TabsTrigger
              value="available"
              className="flex items-center gap-2 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all duration-200 text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              style={
                { '--tw-bg-opacity': '1' } as React.CSSProperties & {
                  [key: string]: string;
                }
              }
              data-active-bg={mainColor}
            >
              Live Learning Platform
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight">
            Belajar Langsung dengan <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tutor Berpengalaman
            </span>
          </h1>

          <TabsContent
            value="available"
            className="space-y-4"
          >
            {LiveClassAvailableError ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                <div className="text-orange-500 mb-3">
                  <svg
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Fitur Multi-Plan Tidak Tersedia
                </h3>
                <p className="text-orange-600">
                  Terjadi kesalahan saat memuat data multi-plan. Kamu masih
                  dapat menggunakan tab lain.
                </p>
              </div>
            ) : LiveClassAvailableIsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'calendar' ? (
              <CalendarView
                liveClass={LiveClassAvailable || []}
                onJoin={() => {}}
                onRate={() => {}}
                onUpgrade={() => {}}
              />
            ) : (
              <>
                {LiveClassAvailable && LiveClassAvailable?.length > 0 && (
                  <div
                    className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
                  >
                    {LiveClassAvailable?.map((liveClass) => (
                      <LiveClassCard
                        key={liveClass.id}
                        liveClass={liveClass}
                        onJoin={() => {}}
                        onRate={() => {}}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
                {LiveClassAvailable?.length === 0 && (
                  <EmptyState
                    icon={Crown}
                    title="Belum ada live class premium"
                    description="Live class premium dengan plan requirements akan muncul di sini. Saat ini belum ada live class yang dikaitkan dengan paket premium."
                  />
                )}
              </>

              // <div className="space-y-6">
              //   {LiveClassAvailable && LiveClassAvailable?.length > 0 && (
              //     <div>
              //       <div className="flex items-center gap-2 mb-4">
              //         <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              //           <Video className="w-4 h-4 text-green-600" />
              //         </div>
              //         <h3 className="text-lg font-semibold text-green-800">
              //           ✅ Dapat Diakses ({LiveClassAvailable?.length})
              //         </h3>
              //       </div>
              //       <div
              //         className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
              //       >
              //         {LiveClassAvailable?.map((liveClass) => (
              //           <LiveClassCard
              //             key={liveClass.id}
              //             liveClass={liveClass}
              //             onJoin={() => {}}
              //             onRate={() => {}}
              //             showPlanInfo={true}
              //             viewMode={viewMode}
              //           />
              //         ))}
              //       </div>
              //     </div>
              //   )}

              //   {LiveClassAvailable && LiveClassAvailable?.length > 0 && (
              //     <div>
              //       <div className="flex items-center gap-2 mb-4">
              //         <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              //           <Award className="w-4 h-4 text-orange-600" />
              //         </div>
              //         <h3 className="text-lg font-semibold text-orange-800">
              //           🔒 Perlu Upgrade ({LiveClassAvailable?.length})
              //         </h3>
              //       </div>
              //       <div
              //         className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
              //       >
              //         {LiveClassAvailable?.map((liveClass) => (
              //           <LiveClassCard
              //             key={liveClass.id}
              //             liveClass={liveClass}
              //             onJoin={() => {}}
              //             onRate={() => {}}
              //             onUpgrade={() => {}}
              //             showPlanInfo={true}
              //             viewMode={viewMode}
              //           />
              //         ))}
              //       </div>
              //     </div>
              //   )}

              //   {LiveClassAvailable?.length === 0 && (
              //     <EmptyState
              //       icon={Crown}
              //       title="Belum ada live class premium"
              //       description="Live class premium dengan plan requirements akan muncul di sini. Saat ini belum ada live class yang dikaitkan dengan paket premium."
              //     />
              //   )}
              // </div>
            )}
          </TabsContent>

          <TabsContent
            value="registered"
            className="space-y-4"
          >
            {viewMode === 'calendar' ? (
              <CalendarView
                liveClass={LiveClassRegistered || []}
                onJoin={() => {}}
                onRate={() => {}}
                onUpgrade={() => {}}
              />
            ) : LiveClassRegistered && LiveClassRegistered?.length > 0 ? (
              <div
                className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
              >
                {LiveClassRegistered?.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={() => {}}
                    onRate={() => {}}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="Belum ada kelas terdaftar"
                description="Kelas yang sudah Kamu daftarkan akan muncul di sini."
              />
            )}
          </TabsContent>

          <TabsContent
            value="invited"
            className="space-y-4"
          >
            {viewMode === 'calendar' ? (
              <CalendarView
                liveClass={LiveClassInvited || []}
                onJoin={() => {}}
                onRate={() => {}}
                onUpgrade={() => {}}
              />
            ) : LiveClassInvited && LiveClassInvited?.length > 0 ? (
              <div
                className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
              >
                {LiveClassInvited?.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={() => {}}
                    onRate={() => {}}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Video}
                title="Belum ada undangan kelas"
                description="Kelas yang sudah diundang admin akan muncul di sini."
              />
            )}
          </TabsContent>

          <TabsContent
            value="completed"
            className="space-y-4"
          >
            {viewMode === 'calendar' ? (
              <CalendarView
                liveClass={LiveClassCompleted || []}
                onJoin={() => {}}
                onRate={() => {}}
                onUpgrade={() => {}}
              />
            ) : LiveClassCompleted && LiveClassCompleted?.length > 0 ? (
              <div
                className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
              >
                {LiveClassCompleted?.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={() => {}}
                    onRate={() => {}}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                title="Belum ada kelas selesai"
                description="Kelas yang sudah selesai akan muncul di sini."
              />
            )}
          </TabsContent>
        </Tabs>

        {/* <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={closeRatingModal}
          liveClass={ratingModal.liveClass}
          onSubmit={handleRatingSubmit}
        />
        <JoinLiveClassModal
          isOpen={joinModal.isOpen}
          onClose={closeJoinModal}
          liveClass={joinModal.liveClass}
          onSuccess={handleJoinSuccess}
        /> */}
      </div>
    </div>
  );
}

const UpcomingCard = ({ liveClass }: { liveClass: LiveClassAvailableType }) => {
  const timeLeft = useCountdown(liveClass.startDate);

  return (
    <div className="quick-action-card bg-white rounded-lg border p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm line-clamp-2 flex-1 pr-2">
          {liveClass.title}
        </h4>
        <div className="flex flex-col items-end gap-1">
          <Badge className="status-badge text-xs bg-blue-100 text-blue-800 border-blue-300 shrink-0">
            {liveClass.status}
          </Badge>
          <div className="text-xs font-mono text-gray-500">
            #{liveClass.id.slice(-6).toUpperCase()}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-600 mb-2">
        <div className="flex items-center gap-1 mb-1">
          <Clock className="h-3 w-3" />
          <span>{formatDateTime(liveClass.startDate)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{liveClass.Instructor.name}</span>
        </div>
      </div>
      {!timeLeft.isExpired && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Dimulai dalam:</div>
          <div className="flex gap-1">
            {timeLeft.days > 0 && (
              <div className="bg-gray-100 rounded px-2 py-1">
                <div className="text-xs font-bold">{timeLeft.days}</div>
                <div className="text-xs text-gray-500">hari</div>
              </div>
            )}
            <div className="bg-gray-100 rounded px-2 py-1">
              <div className="text-xs font-bold">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500">jam</div>
            </div>
            <div className="bg-gray-100 rounded px-2 py-1">
              <div className="text-xs font-bold">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500">mnt</div>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {/* {liveClass.canJoin && (
                            <Button
                              size="sm"
                              onClick={() => handleJoinClass(liveClass)}
                              className="flex-1 h-7 text-xs"
                            >
                              {liveClass.status === 'Sedang Berlangsung' ? (
                                <>
                                  <Video className="mr-1 h-3 w-3" />
                                  Join Live
                                </>
                              ) : (
                                'Bergabung'
                              )}
                            </Button>
                          )} */}
        <Link
          href={`/${website_sub_category_id}/user/live-class/${liveClass.id}`}
        >
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 bg-transparent"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

function LiveClassCard({
  liveClass,
  onJoin,
  onRate,
  onUpgrade,
  showPlanInfo = false,
  viewMode = 'list',
  variant = 'accessible', // NEW: Default variant
}: {
  liveClass: LiveClassAvailableType;
  onJoin: (liveClass: LiveClassAvailableType) => void;
  onRate: (liveClass: LiveClassAvailableType) => void;
  onUpgrade?: (liveClass: any) => void;
  showPlanInfo?: boolean;
  viewMode?: 'list' | 'grid' | 'calendar';
  variant?: 'accessible' | 'preview' | 'locked'; // NEW: Marketing variants
}) {
  const liveClassWithAccess = liveClass as any;
  const timeLeft = useCountdown(liveClass.startDate);
  const isUpcoming = liveClass.status === 'Akan Datang' && !timeLeft.isExpired;
  const isLive = liveClass.status === 'Sedang Berlangsung';

  // Grid view - more compact card
  if (viewMode === 'grid') {
    return (
      <Card className="live-class-card hover:shadow-xl transition-all duration-300 border-0 rounded-2xl overflow-hidden group">
        <CardContent className="p-0">
          {/* Header with gradient and status */}
          <div className="relative p-4 bg-linear-to-br from-blue-50 to-indigo-50">
            <div className="flex justify-between items-start mb-3">
              <Badge
                className={`status-badge ${getStatusColor(liveClass.status)} shadow-sm`}
              >
                {liveClass.status}
              </Badge>
              {isLive && (
                <div className="live-indicator flex items-center gap-1 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-xs font-medium">LIVE</span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {liveClass.title}
            </h3>
            {/* Countdown for upcoming classes */}
            {isUpcoming && (
              <div className="mb-3">
                <CountdownTimer timeLeft={timeLeft} />
              </div>
            )}
          </div>
          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Header with ID */}
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm line-clamp-2 flex-1 pr-2">
                {liveClass.title}
              </h4>
              <Badge
                variant="secondary"
                className="text-xs font-mono bg-gray-100 text-gray-600 border-gray-300 shrink-0 ml-2"
              >
                #{liveClass.id.slice(-6).toUpperCase()}
              </Badge>
            </div>
            {/* Instructor */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={liveClass.Instructor.image || undefined} />
                <AvatarFallback className="text-xs">
                  {liveClass.Instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-800 line-clamp-1">
                  {liveClass.Instructor.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {liveClass.Instructor.certificate && (
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 line-clamp-1 max-w-[150px] truncate">
                      {liveClass.Instructor.certificate}
                    </span>
                  )}
                  {liveClass.Instructor.lastEducation && (
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 line-clamp-1 max-w-[150px] truncate">
                      {liveClass.Instructor.lastEducation}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Time info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {formatDateTime(liveClass.startDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{formatDuration(liveClass.duration)}</span>
              </div>
            </div>

            {/* Preview Content for marketing variant */}
            {liveClassWithAccess.needsUpgrade && showPlanInfo && (
              <div className="border-t pt-3">
                <PreviewContent liveClass={liveClass} />
              </div>
            )}
            {/* Plan info */}
            {showPlanInfo && liveClassWithAccess.userAccess && (
              <div className="border-t pt-3">
                <div className="flex flex-wrap gap-1">
                  {liveClassWithAccess.requiredPlans?.length > 0 ? (
                    liveClassWithAccess.requiredPlans
                      .slice(0, 2)
                      .map((plan: any, index: number) => (
                        <Badge
                          key={index}
                          variant={
                            liveClassWithAccess.userAccess.canRegister
                              ? 'default'
                              : 'outline'
                          }
                          className={`text-xs ${
                            liveClassWithAccess.userAccess.canRegister
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-orange-100 text-orange-800 border-orange-300'
                          }`}
                        >
                          <span className="mr-1">
                            {liveClassWithAccess.userAccess.canRegister
                              ? '✅'
                              : '🔒'}
                          </span>
                          {typeof plan === 'string' ? plan : plan.name}
                        </Badge>
                      ))
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      📖 Free
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {/* Actions with Enhanced Layout */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <div className="flex gap-2 flex-1">
                {liveClassWithAccess.needsUpgrade && showPlanInfo ? (
                  <MarketingCTA
                    liveClass={liveClass}
                    compact={true}
                  />
                ) : (
                  <>
                    {/* {liveClass.canJoin && (
                      <Button
                        onClick={() => onJoin(liveClass)}
                        className="flex-1 h-10 text-sm font-medium"
                        style={{
                          backgroundColor: isLive ? '#ef4444' : undefined,
                        }}
                      >
                        {isLive ? (
                          <>
                            <Video className="mr-2 h-4 w-4" />
                            Join Live Now
                          </>
                        ) : (
                          <>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Bergabung
                          </>
                        )}
                      </Button>
                    )} */}
                    {showPlanInfo &&
                      liveClassWithAccess.needsUpgrade &&
                      onUpgrade && (
                        <Button
                          variant="outline"
                          onClick={() => onUpgrade(liveClass)}
                          className="flex-1 h-10 text-sm border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          🔒 Upgrade Plan
                        </Button>
                      )}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg">
                  <div className="flex gap-2 text-xs text-gray-500 text-center">
                    <Users className="h-3 w-3 mx-auto mb-1" />
                    <div className="font-medium text-gray-700">
                      {liveClass.participants?.length || 0}
                    </div>
                  </div>
                  {/* {liveClass.ratingStats &&
                    liveClass.ratingStats.totalRatings > 0 && (
                      <div className="text-xs text-gray-500 text-center border-l border-gray-200 pl-2">
                        <Star className="h-3 w-3 mx-auto mb-1 fill-yellow-400 text-yellow-400" />
                        <div className="font-medium text-gray-700">
                          {liveClass.ratingStats.averageRating.toFixed(1)}
                        </div>
                      </div>
                    )} */}
                  <Link
                    href={`/${website_sub_category_id}/user/live-class/${liveClass.id}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 ml-2 px-4 bg-transparent"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      <span className="hidden sm:inline">Detail</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view - Modern redesigned layout
  return (
    <Card className="hover:shadow-xl transition-all duration-500 border border-gray-100 rounded-2xl overflow-hidden cursor-pointer group bg-white hover:border-blue-200">
      <CardContent className="p-0">
        {/* Modern Header with Floating Elements */}
        <div className="relative bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-6">
          {/* Floating Status Elements */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <Badge
              className={`status-badge ${getStatusColor(liveClass.status)} shadow-lg backdrop-blur-sm`}
            >
              {liveClass.status}
            </Badge>
            {isLive && (
              <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                LIVE
              </div>
            )}
          </div>
          <div className="flex items-start gap-4 pr-16">
            {/* Instructor Avatar - Larger and more prominent */}
            <div className="relative shrink-0">
              <Avatar className="h-16 w-16 border-3 border-white shadow-lg ring-2 ring-blue-100">
                <AvatarImage src={liveClass.Instructor.image || undefined} />
                <AvatarFallback className="text-lg font-bold bg-linear-to-br from-blue-400 to-indigo-500 text-white">
                  {liveClass.Instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              {liveClass.Instructor.certificate && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-lg">
                  <Award className="h-3 w-3" />
                </div>
              )}
            </div>
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <Badge
                  variant="outline"
                  className="text-xs font-mono bg-white/80 text-gray-600 border-gray-300"
                >
                  #{liveClass.id.slice(-6).toUpperCase()}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                {liveClass.title}
              </h3>
              {/* Instructor Info - Elegant layout */}
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800 text-base line-clamp-1">
                    {liveClass.Instructor.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {liveClass.Instructor.certificate && (
                      <span
                        className={`text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium border border-green-200 line-clamp-1 ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'max-w-[150px] truncate' : ''}`}
                      >
                        ✓ {liveClass.Instructor.certificate}
                      </span>
                    )}
                    {liveClass.Instructor.lastEducation && (
                      <span
                        className={`text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium border border-blue-200 line-clamp-1 ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'max-w-[150px] truncate' : ''}`}
                      >
                        🎓 {liveClass.Instructor.lastEducation}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Time Information - Clean layout */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Tanggal
                    </p>
                    <p className="font-semibold text-gray-800">
                      {formatDateTime(liveClass.startDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Durasi
                    </p>
                    <p className="font-semibold text-gray-800">
                      {formatDuration(liveClass.duration)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Countdown Timer - Modern design */}
          {isUpcoming && !timeLeft.isExpired && (
            <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
              <div className="text-xs text-gray-600 mb-2 text-center font-medium uppercase tracking-wide">
                Dimulai dalam
              </div>
              <div className="flex justify-center">
                <CountdownTimer timeLeft={timeLeft} />
              </div>
            </div>
          )}
          {/* Status Indicator for non-upcoming */}
          {!isUpcoming && (
            <div className="mt-4 flex justify-center">
              {isLive && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Sedang Berlangsung
                </div>
              )}
              {liveClass.status === 'Selesai' && (
                <div className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Kelas Selesai
                </div>
              )}
            </div>
          )}
        </div>
        {/* Content Section - Cleaner layout */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
            {liveClass.description}
          </p>
        </div>

        {/* MAIN CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* LIVECLASS CARD */}
          <Card className="group relative hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden bg-white">
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${mainColor}05, ${secondaryColor}05)`,
              }}
            />

            {/* Top accent bar */}
            <div
              className="h-3 w-full"
              style={{
                background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
              }}
            />

            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{
                      backgroundColor: `${mainColor}20`,
                      border: `2px solid ${mainColor}40`,
                    }}
                  >
                    <PlayCircle
                      className="w-8 h-8"
                      style={{ color: mainColor }}
                    />
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div
                  className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: mainColor }}
                >
                  ⚡ Interaktif
                </div>
              </div>
              <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                Liveclass
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Kelas live dengan interaksi langsung bersama tutor
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
              {/* Features List */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <MessageCircle
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      Tanya Jawab Real-Time
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Interaksi langsung dengan tutor selama kelas berlangsung
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Users
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Komunitas Belajar</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Belajar bersama siswa lain dengan tujuan sama
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Clock
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Jadwal Teratur</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Kelas dengan jadwal tetap yang konsisten
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Award
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      Sertifikat Kehadiran
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Dapatkan sertifikat setelah menyelesaikan kelas
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* CTA Button */}
              <Link
                href={`/${website_sub_category_id}/user/live-learning/liveclass`}
                className="block"
              >
                <Button
                  className="w-full h-13 text-base font-bold rounded-xl group/btn text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  style={{ backgroundColor: mainColor }}
                >
                  <span className="relative z-10">Jelajahi Liveclass</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* LIVESTREAM CARD */}
          <Card className="group relative hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden bg-white">
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor}05, ${mainColor}05)`,
              }}
            />

            {/* Top accent bar */}
            <div
              className="h-3 w-full"
              style={{
                background: `linear-gradient(90deg, ${secondaryColor}, ${mainColor})`,
              }}
            />

            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{
                      backgroundColor: `${secondaryColor}20`,
                      border: `2px solid ${secondaryColor}40`,
                    }}
                  >
                    <Tv
                      className="w-8 h-8"
                      style={{ color: secondaryColor }}
                    />
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <Radio className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div
                  className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: secondaryColor }}
                >
                  📡 Live Broadcast
                </div>
              </div>
              <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                Livestream
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Siaran langsung untuk jangkauan peserta yang lebih luas
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
              {/* Features List */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${secondaryColor}15` }}
                    >
                      <Radio
                        className="w-5 h-5"
                        style={{ color: secondaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Broadcast HD</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Siaran berkualitas tinggi dari studio profesional
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${secondaryColor}15` }}
                    >
                      <Users
                        className="w-5 h-5"
                        style={{ color: secondaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Akses Massal</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Ribuan peserta bisa menonton bersamaan
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${secondaryColor}15` }}
                    >
                      <Clock
                        className="w-5 h-5"
                        style={{ color: secondaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Rekaman On-Demand</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tonton ulang kapan saja sesuai kenyamanan
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${secondaryColor}15` }}
                    >
                      <Award
                        className="w-5 h-5"
                        style={{ color: secondaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      Materi Berkualitas
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Konten expert yang sesuai kebutuhan ujian
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* CTA Button */}
              <Link
                href={`/${website_sub_category_id}/user/live-learning/livestream`}
                className="block"
              >
                <Button
                  className="w-full h-13 text-base font-bold rounded-xl group/btn text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <span className="relative z-10">Jelajahi Livestream</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* COMPARISON SECTION */}
        <Card className="border-0 rounded-3xl overflow-hidden shadow-lg mb-12">
          <CardHeader
            className="pb-4"
            style={{ backgroundColor: `${mainColor}08` }}
          >
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
              Perbandingan Liveclass vs Livestream
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Fitur
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">
                      Liveclass
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">
                      Livestream
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Interaksi Langsung
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Jangkauan Peserta
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-600">Terbatas</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-900 font-semibold">
                        Ribuan Orang
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Jadwal Kelas
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Rekaman
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Sertifikat
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA SECTION */}
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">
            Pilih metode pembelajaran yang paling sesuai dengan gaya belajar
            Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${website_sub_category_id}/user/live-learning/liveclass`}
            >
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold rounded-xl text-white"
                style={{ backgroundColor: mainColor }}
              >
                Mulai Liveclass
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link
              href={`/${website_sub_category_id}/user/live-learning/livestream`}
            >
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-semibold rounded-xl border-2"
                style={{
                  color: secondaryColor,
                  borderColor: secondaryColor,
                }}
              >
                Mulai Livestream
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
