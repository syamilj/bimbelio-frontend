// Decorative Background Patterns

export const DecorativePatterns = {
  // Gradient Mesh Background
  GradientMesh: ({
    colors = ['#0066FF', '#4C94FF'],
  }: {
    colors?: string[];
  }) => (
    <div className="absolute inset-0 opacity-5 overflow-hidden">
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
  DotPattern: () => (
    <div className="absolute inset-0 opacity-[0.03]">
      <svg
        width="100%"
        height="100%"
      >
        <pattern
          id="dot-pattern"
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
          fill="url(#dot-pattern)"
        />
      </svg>
    </div>
  ),

  // Grid Pattern
  GridPattern: () => (
    <div className="absolute inset-0 opacity-[0.02]">
      <svg
        width="100%"
        height="100%"
      >
        <pattern
          id="grid-pattern"
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
          fill="url(#grid-pattern)"
        />
      </svg>
    </div>
  ),

  // Wave Pattern
  WavePattern: ({ color = '#0066FF' }: { color?: string }) => (
    <div className="absolute bottom-0 left-0 right-0 opacity-5">
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
  FloatingShapes: ({ color = '#0066FF' }: { color?: string }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Circle */}
      <div
        className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-5 animate-float"
        style={{ backgroundColor: color, animationDelay: '0s' }}
      />
      {/* Square */}
      <div
        className="absolute bottom-20 left-10 w-24 h-24 rounded-3xl opacity-5 animate-float"
        style={{ backgroundColor: color, animationDelay: '2s' }}
      />
      {/* Triangle */}
      <div
        className="absolute top-1/2 right-1/4 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-transparent opacity-5 animate-float"
        style={{ borderBottomColor: color, animationDelay: '4s' }}
      />
    </div>
  ),

  // Sparkles
  Sparkles: () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-twinkle" />
      <div
        className="absolute top-20 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-twinkle"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-twinkle"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-32 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-twinkle"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-twinkle"
        style={{ animationDelay: '4s' }}
      />
    </div>
  ),

  // Confetti (for achievements)
  Confetti: () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => {
        const colors = [
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#FFA07A',
          '#98D8C8',
          '#F7DC6F',
        ];
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 3;
        const size = 6 + Math.random() * 8;

        return (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${left}%`,
              top: `-20px`,
              animationDelay: `${animationDelay}s`,
            }}
          >
            <div
              className="rounded-3xl rotate-45 animate-confetti-spin"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
              }}
            />
          </div>
        );
      })}
    </div>
  ),
};

// Add these animations to your global CSS or tailwind.config.ts
// @keyframes float {
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-20px); }
// }
// @keyframes twinkle {
//   0%, 100% { opacity: 0; }
//   50% { opacity: 1; }
// }
// @keyframes confetti-fall {
//   to { transform: translateY(100vh); }
// }
// @keyframes confetti-spin {
//   to { transform: rotate(360deg); }
// }
