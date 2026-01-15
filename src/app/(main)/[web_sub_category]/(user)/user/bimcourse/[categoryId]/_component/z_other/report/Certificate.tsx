import { Card, CardContent } from '@/components/ui/card';
import { CheckCircleIcon } from 'lucide-react';
import Image from 'next/image';

interface CertificateProps {
  name: string;
  courseName: string;
  aspectRatio: '9-16' | '16-9';
}

export default function Certificate({
  name,
  courseName,
  aspectRatio,
}: CertificateProps) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const aspectClass =
    aspectRatio === '9-16' ? 'aspect-9/16' : 'aspect-video';

  return (
    <div
      className={`w-full ${aspectClass} relative overflow-hidden bg-linear-to-br from-blue-50 to-white`}
    >
      {/* Background Pattern */}
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Clip%20path%20group-v4SCInpIbLCZkcxLx7dGtPRNpIUnK2.png"
        alt="Background"
        fill
        className="object-cover opacity-30"
        priority
      />

      <Card className="absolute inset-0 bg-transparent shadow-none border-0">
        <CardContent className="relative w-full h-full flex flex-col items-center justify-center p-6 ">
          {/* Header */}

          {/* Main Content */}
          <div className="text-center space-y-2 grow flex flex-col justify-center">
            <div className="w-full text-center">
              <div className="relative w-full h-12 mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-White-16:9-vEbhZ999MJFwslR8y73eQAX1U6OOc3.png"
                  alt="Bimbelio Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-blue-600 mb-2">
              Sertifikat Penyelesaian
            </h2>
            <div className="w-1/3 h-1 bg-linear-to-r from-blue-400 via-blue-600 to-blue-400 rounded-full mx-auto" />
            <p className="text-LG text-gray-600">Diberikan kepada</p>
            <p className="text-xl font-bold text-blue-700 relative inline-block">
              {name}
            </p>
            <p className="text-lg text-gray-600">atas penyelesaian</p>
            <p className="text-lg italic font-bold text-blue-600 relative inline-block">
              {courseName}
            </p>
          </div>

          {/* Footer */}
          <div className="w-full">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100">
                  <Image
                    src="/logo-1-blue.png"
                    alt="alt"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Bimbelio</p>
                  <p className="text-xs text-gray-500">{currentDate}</p>
                </div>
              </div>
            </div>
            <div className="xl:hidden flex items-center justify-center gap-1 mb-6">
              <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
              <p className="text-sm font-semibold text-yellow-600">
                Terverifikasi
              </p>
            </div>
            <div className="w-full h-1 bg-linear-to-r from-blue-200 via-blue-400 to-blue-200 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 rounded border-blue-200" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 rounded border-blue-200" />
    </div>
  );
}
