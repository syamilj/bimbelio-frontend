// Decorative Background Patterns for Quiz Components

export const DecorativePatterns = {
  // Gradient Mesh Background
  GradientMesh: ({
    colors = ['#0091FF', '#5aa4dd'],
  }: {
    colors?: string[];
  }) => (
    <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors[0]}50 0%, transparent 70%)`,
        }}
      />
    </div>
  ),

  // Dot Pattern
  DotPattern: ({ id = 'quiz-dot-pattern' }: { id?: string }) => (
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
      <svg
        width="100%"
        height="100%"
      >
        <pattern
          id={id}
          x="0"
          y="0"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="2"
            cy="2"
            r="1.5"
            fill="currentColor"
          />
        </pattern>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id})`}
        />
      </svg>
    </div>
  ),

  // Grid Pattern
  GridPattern: ({ id = 'quiz-grid-pattern' }: { id?: string }) => (
    <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
      <svg
        width="100%"
        height="100%"
      >
        <pattern
          id={id}
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id})`}
        />
      </svg>
    </div>
  ),

  // Wave Pattern
  WavePattern: ({ color = '#0091FF' }: { color?: string }) => (
    <div className="absolute bottom-0 left-0 right-0 opacity-5 pointer-events-none">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-24"
      >
        <path
          d="M0,0 C150,50 350,0 600,50 C850,100 1050,50 1200,75 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  ),

  // Floating Shapes
  FloatingShapes: ({ color = '#0091FF' }: { color?: string }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-5 animate-pulse"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute bottom-20 left-10 w-24 h-24 rounded-3xl opacity-5 animate-pulse"
        style={{ backgroundColor: color, animationDelay: '1s' }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full opacity-5 animate-pulse"
        style={{ backgroundColor: color, animationDelay: '2s' }}
      />
    </div>
  ),

  // Sparkles for premium/achievement
  Sparkles: () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
      <div
        className="absolute top-20 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"
        style={{ animationDelay: '0.5s' }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-32 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping"
        style={{ animationDelay: '1.5s' }}
      />
      <div
        className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"
        style={{ animationDelay: '2s' }}
      />
    </div>
  ),

  // Battle/Competition flames
  BattleFlames: ({ color = '#f97316' }: { color?: string }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -bottom-10 left-1/4 w-40 h-40 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -bottom-10 right-1/4 w-32 h-32 rounded-full blur-3xl opacity-15 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animationDelay: '0.5s',
        }}
      />
    </div>
  ),

  // Podium Glow for leaderboard
  PodiumGlow: ({ rank }: { rank: 1 | 2 | 3 }) => {
    const colors = {
      1: '#fbbf24', // gold
      2: '#94a3b8', // silver
      3: '#f97316', // bronze
    };
    return (
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-30 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${colors[rank]} 0%, transparent 70%)`,
        }}
      />
    );
  },

  // Stats Card Glow
  CardGlow: ({ color = '#0091FF' }: { color?: string }) => (
    <div
      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${color}10 0%, transparent 70%)`,
      }}
    />
  ),
};
