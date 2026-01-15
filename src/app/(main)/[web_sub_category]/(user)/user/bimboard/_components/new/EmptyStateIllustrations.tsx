// Empty State Illustrations

export const EmptyStateIllustrations = {
  NoTryouts: () => (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background Circle */}
      <circle cx="100" cy="100" r="80" fill="#F1F5F9" />

      {/* Target Circles */}
      <circle cx="100" cy="100" r="50" fill="white" stroke="#E2E8F0" strokeWidth="3" />
      <circle cx="100" cy="100" r="35" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2" />
      <circle cx="100" cy="100" r="20" fill="#818CF8" />

      {/* Arrow */}
      <path
        d="M140 60L110 90M110 90L115 85M110 90L115 95"
        stroke="#6366F1"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stars */}
      <path
        d="M160 40L162 46L168 48L162 50L160 56L158 50L152 48L158 46L160 40Z"
        fill="#FBBF24"
      />
      <path
        d="M50 60L51 64L55 65L51 66L50 70L49 66L45 65L49 64L50 60Z"
        fill="#A78BFA"
      />
    </svg>
  ),

  NoCourses: () => (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <circle cx="100" cy="100" r="80" fill="#F0FDF4" />

      {/* Book */}
      <rect x="70" y="60" width="60" height="80" rx="4" fill="white" stroke="#10B981" strokeWidth="3" />
      <rect x="70" y="60" width="15" height="80" fill="#10B981" />

      {/* Pages */}
      <line x1="95" y1="75" x2="120" y2="75" stroke="#D1FAE5" strokeWidth="2" />
      <line x1="95" y1="85" x2="120" y2="85" stroke="#D1FAE5" strokeWidth="2" />
      <line x1="95" y1="95" x2="115" y2="95" stroke="#D1FAE5" strokeWidth="2" />

      {/* Bookmark */}
      <path d="M100 60L105 65L100 70L95 65L100 60Z" fill="#FDE047" />

      {/* Sparkles */}
      <circle cx="50" cy="70" r="3" fill="#34D399" />
      <circle cx="145" cy="75" r="2" fill="#6EE7B7" />
      <circle cx="55" cy="130" r="2" fill="#10B981" />
    </svg>
  ),

  NoDocuments: () => (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <circle cx="100" cy="100" r="80" fill="#FEF3C7" />

      {/* Document Stack */}
      <rect x="70" y="75" width="50" height="65" rx="3" fill="#FCD34D" opacity="0.5" />
      <rect x="75" y="70" width="50" height="65" rx="3" fill="#FBBF24" opacity="0.7" />
      <rect x="80" y="65" width="50" height="65" rx="3" fill="white" stroke="#F59E0B" strokeWidth="2" />

      {/* Document Lines */}
      <line x1="90" y1="80" x2="120" y2="80" stroke="#FDE68A" strokeWidth="2" />
      <line x1="90" y1="90" x2="120" y2="90" stroke="#FDE68A" strokeWidth="2" />
      <line x1="90" y1="100" x2="115" y2="100" stroke="#FDE68A" strokeWidth="2" />
      <line x1="90" y1="110" x2="118" y2="110" stroke="#FDE68A" strokeWidth="2" />

      {/* Corner Fold */}
      <path d="M120 65L130 75L120 75V65Z" fill="#FCD34D" />
    </svg>
  ),

  NoLiveClass: () => (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <circle cx="100" cy="100" r="80" fill="#FCE7F3" />

      {/* Camera */}
      <rect x="65" y="75" width="70" height="50" rx="8" fill="white" stroke="#EC4899" strokeWidth="3" />
      <circle cx="100" cy="100" r="15" fill="#F9A8D4" stroke="#EC4899" strokeWidth="2" />
      <circle cx="100" cy="100" r="8" fill="#EC4899" />

      {/* Lens */}
      <path d="M135 85L150 75L150 115L135 105V85Z" fill="#EC4899" />

      {/* Recording Dot */}
      <circle cx="75" cy="85" r="4" fill="#EF4444" className="animate-pulse" />
    </svg>
  ),

  NoActivity: () => (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <circle cx="100" cy="100" r="80" fill="#F5F3FF" />

      {/* Clock */}
      <circle cx="100" cy="100" r="40" fill="white" stroke="#8B5CF6" strokeWidth="4" />
      <circle cx="100" cy="100" r="3" fill="#8B5CF6" />
      <line x1="100" y1="100" x2="100" y2="75" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="100" x2="120" y2="100" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />

      {/* Zzz */}
      <text x="140" y="65" fill="#C4B5FD" fontSize="20" fontWeight="bold">Z</text>
      <text x="150" y="55" fill="#DDD6FE" fontSize="16" fontWeight="bold">Z</text>
      <text x="158" y="47" fill="#EDE9FE" fontSize="12" fontWeight="bold">Z</text>
    </svg>
  ),

  NoPerformance: () => (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <circle cx="100" cy="100" r="80" fill="#DBEAFE" />

      {/* Chart Bars */}
      <rect x="60" y="110" width="15" height="30" rx="3" fill="#BFDBFE" />
      <rect x="80" y="95" width="15" height="45" rx="3" fill="#93C5FD" />
      <rect x="100" y="80" width="15" height="60" rx="3" fill="#60A5FA" />
      <rect x="120" y="70" width="15" height="70" rx="3" fill="#3B82F6" />

      {/* Trend Line */}
      <path
        d="M67 117L87 102L107 87L127 77"
        stroke="#1D4ED8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="5 5"
      />

      {/* Arrow Up */}
      <path
        d="M135 70L140 65L145 70"
        stroke="#10B981"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),

  NoSchedule: () => (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <circle cx="100" cy="100" r="80" fill="#FEF2F2" />

      {/* Calendar */}
      <rect x="65" y="70" width="70" height="65" rx="6" fill="white" stroke="#EF4444" strokeWidth="3" />

      {/* Calendar Header */}
      <rect x="65" y="70" width="70" height="15" fill="#EF4444" rx="6" />
      <rect x="65" y="78" width="70" height="15" fill="#EF4444" />

      {/* Rings */}
      <rect x="75" y="65" width="6" height="15" rx="3" fill="#DC2626" />
      <rect x="119" y="65" width="6" height="15" rx="3" fill="#DC2626" />

      {/* Calendar Grid */}
      <circle cx="80" cy="100" r="4" fill="#FEE2E2" />
      <circle cx="95" cy="100" r="4" fill="#FEE2E2" />
      <circle cx="110" cy="100" r="4" fill="#FEE2E2" />
      <circle cx="125" cy="100" r="4" fill="#FCA5A5" />
      <circle cx="80" cy="115" r="4" fill="#FEE2E2" />
      <circle cx="95" cy="115" r="4" fill="#EF4444" />
    </svg>
  ),

  NoAchievements: () => (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <circle cx="100" cy="100" r="80" fill="#FFF7ED" />

      {/* Trophy */}
      <path
        d="M85 70H115V80C115 90 110 95 100 95C90 95 85 90 85 80V70Z"
        fill="#FBBF24"
        stroke="#F59E0B"
        strokeWidth="2"
      />
      <rect x="95" y="95" width="10" height="15" fill="#FBBF24" />
      <rect x="85" y="110" width="30" height="8" rx="4" fill="#F59E0B" />

      {/* Handles */}
      <path
        d="M85 70C75 70 70 75 70 80C70 85 75 87 80 87"
        stroke="#FBBF24"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M115 70C125 70 130 75 130 80C130 85 125 87 120 87"
        stroke="#FBBF24"
        strokeWidth="2"
        fill="none"
      />

      {/* Stars */}
      <path d="M100 62L102 68L108 70L102 72L100 78L98 72L92 70L98 68L100 62Z" fill="#FDE047" />
      <path d="M60 90L61 93L64 94L61 95L60 98L59 95L56 94L59 93L60 90Z" fill="#FCD34D" />
      <path d="M140 95L141 97L143 98L141 99L140 101L139 99L137 98L139 97L140 95Z" fill="#FCD34D" />
    </svg>
  ),
};
