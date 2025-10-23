'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Coins, Package, Sparkles, Stars, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export function EmptyPlan({
  type,
  categoryName,
}: {
  type: 'bundle' | 'subscription' | 'coin';
  categoryName?: string;
}) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Icon =
    type === 'bundle' ? Package : type === 'subscription' ? Sparkles : Coins;

  const title =
    type === 'bundle'
      ? 'Paket Bundle Segera Hadir'
      : type === 'subscription'
        ? 'Paket Berlangganan Segera Hadir'
        : 'Paket Coin Segera Hadir';

  const description =
    type === 'bundle'
      ? `Kami sedang menyiapkan paket bundle terbaik untuk kategori ${categoryName || 'ini'}. Nantikan penawaran spesial kami!`
      : type === 'subscription'
        ? `Kami sedang menyiapkan paket berlangganan terbaik untuk kategori ${categoryName || 'ini'}. Dapatkan akses unlimited dengan harga spesial!`
        : `Kami sedang menyiapkan paket coin dengan nilai terbaik untukmu. Top up coin dan nikmati fleksibilitas maksimal!`;

  // Floating particles positions
  const particles = [
    { top: '10%', left: '15%', delay: '0s', duration: '3s' },
    { top: '20%', right: '20%', delay: '0.5s', duration: '4s' },
    { bottom: '15%', left: '10%', delay: '1s', duration: '3.5s' },
    { bottom: '25%', right: '15%', delay: '1.5s', duration: '4.5s' },
    { top: '40%', left: '5%', delay: '2s', duration: '3s' },
    { top: '50%', right: '8%', delay: '0.3s', duration: '4s' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center py-16 px-4 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle, ${mainColor}40, transparent)`,
            animationDuration: '4s',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle, ${secondaryColor}40, transparent)`,
            animationDuration: '5s',
            animationDelay: '1s',
          }}
        />
      </div>

      {/* Floating Particles */}
      {mounted &&
        particles.map((particle, index) => (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              ...particle,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
            }}
          >
            <Sparkles
              className="h-4 w-4 opacity-30"
              style={{ color: index % 2 === 0 ? mainColor : secondaryColor }}
            />
          </div>
        ))}

      {/* Main Content */}
      <div
        className={`relative z-10 ${mounted ? 'animate-scale-in' : 'opacity-0'}`}
      >
        {/* Icon Container with Enhanced Effects */}
        <div className="relative mb-8">
          {/* Outer Rotating Ring */}
          {/* <div
            className="absolute inset-0 -m-6 rounded-full animate-spin-slow opacity-20"
            style={{
              background: `conic-gradient(from 0deg, ${mainColor}, ${secondaryColor}, ${mainColor})`,
              filter: 'blur(20px)',
            }}
          /> */}

          {/* Middle Pulse Ring */}
          <div
            className="absolute inset-0 -m-3 rounded-full animate-ping"
            style={{
              backgroundColor: mainColor,
              opacity: 0.1,
              animationDuration: '2s',
            }}
          />

          {/* Main Icon Card */}
          <div
            className="relative bg-gradient-to-br from-white via-white to-gray-50 rounded-full p-12 shadow-2xl border-2 transform transition-transform hover:scale-105 duration-300"
            style={{
              borderColor: `${mainColor}30`,
              boxShadow: `0 20px 60px -15px ${mainColor}40`,
            }}
          >
            {/* Icon Glow Effect */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse"
              style={{ backgroundColor: mainColor }}
            />

            {/* Decorative Corner Elements */}
            <div className="absolute top-2 right-2">
              <Stars
                className="h-5 w-5 animate-pulse"
                style={{ color: mainColor }}
              />
            </div>
            <div className="absolute bottom-2 left-2">
              <Zap
                className="h-5 w-5 animate-pulse"
                style={{ color: secondaryColor }}
              />
            </div>

            {/* Main Icon */}
            <div className="relative animate-bounce-slow">
              <Icon
                className="h-24 w-24 mx-auto drop-shadow-lg"
                style={{ color: mainColor }}
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 text-center">
          <h3
            className="text-3xl font-bold bg-clip-text text-transparent animate-gradient"
            style={{
              backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor}, ${mainColor})`,
              backgroundSize: '200% auto',
            }}
          >
            {title}
          </h3>

          <p className="text-gray-600 text-center max-w-md mx-auto leading-relaxed">
            {description}
          </p>

          {/* Coming Soon Badge */}
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-lg animate-bounce-subtle"
            style={{
              background: `linear-gradient(135deg, ${mainColor}15, ${secondaryColor}15)`,
              border: `2px solid ${mainColor}30`,
            }}
          >
            <Sparkles
              className="h-5 w-5 animate-spin-slow"
              style={{ color: mainColor }}
            />
            <span
              className="font-bold text-lg tracking-wide"
              style={{ color: mainColor }}
            >
              Coming Soon
            </span>
            <Sparkles
              className="h-5 w-5 animate-spin-slow"
              style={{
                color: secondaryColor,
                animationDelay: '1s',
              }}
            />
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div
              className="h-1 w-12 rounded-full animate-pulse"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="h-1 w-12 rounded-full animate-pulse"
              style={{
                backgroundColor: secondaryColor,
                animationDelay: '0.5s',
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
          100% {
            background-position: 0% center;
          }
        }

        .animate-float {
          animation: float infinite ease-in-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-gradient {
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

// import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
// import { Coins, Package, Sparkles } from 'lucide-react';

// export function EmptyPlan({
//   type,
//   categoryName,
// }: {
//   type: 'bundle' | 'subscription' | 'coin';
//   categoryName?: string;
// }) {
//   const { websiteSubCategory } = useWebsiteSubCategory();
//   const mainColor = websiteSubCategory?.main_color || '#0091FF';

//   const Icon =
//     type === 'bundle' ? Package : type === 'subscription' ? Sparkles : Coins;
//   const title =
//     type === 'bundle'
//       ? 'Paket Bundle Segera Hadir'
//       : type === 'subscription'
//         ? 'Paket Berlangganan Segera Hadir'
//         : 'Paket Coin Segera Hadir';
//   const description =
//     type === 'bundle'
//       ? `Kami sedang menyiapkan paket bundle terbaik untuk kategori ${categoryName ? categoryName : 'ini'}. Nantikan penawaran spesial kami!`
//       : type === 'subscription'
//         ? `Kami sedang menyiapkan paket berlangganan terbaik untuk kategori ${categoryName ? categoryName : 'ini'}. Dapatkan akses unlimited dengan harga spesial!`
//         : `Kami sedang menyiapkan paket coin dengan nilai terbaik untukmu. Top up coin dan nikmati fleksibilitas maksimal!`;
//   return (
//     <div className="flex flex-col items-center justify-center py-16 px-4">
//       <div className="relative">
//         <div
//           className="absolute inset-0 blur-3xl opacity-20 rounded-full"
//           style={{ backgroundColor: mainColor }}
//         />
//         <div
//           className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-xl border"
//           style={{ borderColor: `${mainColor}20` }}
//         >
//           <Icon
//             className="h-20 w-20 mx-auto"
//             style={{ color: mainColor }}
//             strokeWidth={1.5}
//           />
//         </div>
//       </div>
//       <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">{title}</h3>
//       <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
//       <div
//         className="flex gap-2 items-center text-sm font-medium"
//         style={{ color: mainColor }}
//       >
//         <Sparkles className="h-4 w-4" />
//         <span>Coming Soon</span>
//       </div>
//     </div>
//   );
// }
