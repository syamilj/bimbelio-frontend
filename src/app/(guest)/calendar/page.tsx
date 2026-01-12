'use client';

import ConsultationDialog from '@/components/_shared/contact/consultation-dialog';
import Navbar from '@/components/_shared/navbar';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Users,
  Zap,
} from 'lucide-react';
import Head from 'next/head';
import { useState } from 'react';

const GOOGLE_CALENDAR_ID = 'bimbelio.marketing@gmail.com';
const GOOGLE_CALENDAR_EMBED_URL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(GOOGLE_CALENDAR_ID)}&ctz=Asia%2FJakarta`;

export default function CalendarPage() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <>
      <Head>
        <title>Jadwal Event - Bimbelio</title>
        <meta
          name="description"
          content="Lihat jadwal webinar, live class, dan ujian coba gratis dari Bimbelio"
        />
        <meta
          property="og:title"
          content="Jadwal Event - Bimbelio"
        />
        <meta
          property="og:description"
          content="Ikuti webinar, live class, dan ujian coba eksklusif gratis dari Bimbelio"
        />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center justify-center gap-3 rounded-3xl px-6 py-3 bg-white shadow-sm border border-gray-100">
              <Calendar
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
              <span className="text-sm font-semibold text-gray-600">
                JADWAL EVENT
              </span>
            </div>

            <h1 className="mb-4 text-4xl md:text-5xl font-black text-gray-900">
              Jadwal Event <span style={{ color: mainColor }}>Bimbelio</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Ikuti webinar, live class, dan ujian coba gratis. Dapatkan ilmu
              baru dan networking dengan sesama pelajar setiap hari.
            </p>
          </motion.div>

          {/* Google Calendar Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-2 overflow-hidden rounded-3xl">
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                }}
              />
              <CardHeader>
                <div className="flex items-center justify-between flex-col md:flex-row gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Jadwal Event Lengkap
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Semua event Bimbelio terupdate secara real-time
                    </p>
                  </div>
                  <a
                    href={`https://calendar.google.com/calendar/u/0?cid=${GOOGLE_CALENDAR_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="rounded-lg gap-2"
                      style={{ backgroundColor: mainColor, color: 'white' }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buka di Google Calendar
                    </Button>
                  </a>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Google Calendar Embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="border-2 rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-white rounded-3xl overflow-hidden">
                  <iframe
                    src={GOOGLE_CALENDAR_EMBED_URL}
                    style={{
                      border: 0,
                      width: '100%',
                      height: '600px',
                      minHeight: '600px',
                    }}
                    title="Jadwal Event Bimbelio"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Event Types Filter & Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Jenis Event Bimbelio
            </h2>

            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Webinar',
                  description: 'Sesi pembelajaran interaktif dengan expert',
                  color: '#3b82f6',
                  bgColor: 'bg-blue-50',
                },
                {
                  icon: Users,
                  title: 'Live Class',
                  description: 'Kelas interaktif dengan diskusi real-time',
                  color: '#10b981',
                  bgColor: 'bg-emerald-50',
                },
                {
                  icon: Award,
                  title: 'Try Out',
                  description: 'Simulasi ujian dengan evaluasi komprehensif',
                  color: '#f59e0b',
                  bgColor: 'bg-amber-50',
                },
              ].map((event, idx) => {
                const EIcon = event.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <Card className="border-2 rounded-3xl h-full hover:shadow-lg transition-shadow overflow-hidden">
                      <div
                        className="h-2 w-full"
                        style={{ backgroundColor: event.color }}
                      />
                      <CardContent className="pt-4 sm:pt-6">
                        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                          <div
                            className="p-2 sm:p-3 rounded-xl"
                            style={{
                              backgroundColor: event.bgColor.includes('blue')
                                ? '#dbeafe'
                                : event.bgColor.includes('emerald')
                                  ? '#d1fae5'
                                  : '#fef3c7',
                            }}
                          >
                            <EIcon
                              className="w-6 h-6 sm:w-8 sm:h-8"
                              style={{ color: event.color }}
                            />
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                            {event.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Kenapa Ikuti Event Bimbelio?
              </h3>

              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    icon: CheckCircle2,
                    title: '100% Gratis',
                    description: 'Semua event gratis untuk semua member',
                  },
                  {
                    icon: Users,
                    title: 'Expert & Interaktif',
                    description: 'Tanya jawab real-time dengan expert',
                  },
                  {
                    icon: Award,
                    title: 'Sertifikat',
                    description: 'Dapatkan sertifikat untuk peserta aktif',
                  },
                ].map((benefit, idx) => {
                  const BIcon = benefit.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4 }}
                      className="group"
                    >
                      <Card className="border-2 rounded-3xl h-full hover:shadow-lg transition-shadow overflow-hidden">
                        <div
                          className="h-2 w-full"
                          style={{ backgroundColor: mainColor }}
                        />
                        <CardContent className="pt-4 sm:pt-6">
                          <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                            <div
                              className="p-2 sm:p-3 rounded-xl"
                              style={{
                                backgroundColor: mainColor + '15',
                              }}
                            >
                              <BIcon
                                className="w-6 h-6 sm:w-8 sm:h-8"
                                style={{ color: mainColor }}
                              />
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                              {benefit.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                              {benefit.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Card
              className="border-2 overflow-hidden rounded-3xl"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(${parseInt(mainColor.slice(1, 3), 16)}, ${parseInt(mainColor.slice(3, 5), 16)}, ${parseInt(mainColor.slice(5, 7), 16)}, 0.05), rgba(${parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.05))`,
              }}
            >
              <div
                className="h-2 w-full"
                style={{
                  background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                }}
              />
              <CardContent className="pt-10 pb-10 px-6 text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  Jangan Lewatkan Event Kami! 🚀
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Subscribe kalender Bimbelio untuk mendapatkan notifikasi
                  langsung setiap ada webinar, live class, atau ujian coba baru.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    className="text-white font-semibold rounded-xl px-8 h-12 gap-2 w-full sm:w-auto"
                    style={{ backgroundColor: mainColor }}
                    onClick={() => setIsConsultationOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Konsultasi Gratis
                  </Button>
                  <a
                    href={`https://calendar.google.com/calendar/u/0?cid=${GOOGLE_CALENDAR_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="font-semibold rounded-xl px-8 h-12 gap-2 w-full sm:w-auto border-2"
                      style={{ color: mainColor, borderColor: mainColor }}
                    >
                      <Calendar className="w-4 h-4" />
                      Subscribe Kalender
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 text-center text-sm text-gray-500 space-y-2"
          >
            <p>
              📱 Kalender ini di-update secara real-time. Semua event baru akan
              langsung tampil di sini.
            </p>
            <p className="text-xs">
              Hubungi:{' '}
              <a
                href={`mailto:${GOOGLE_CALENDAR_ID}`}
                className="font-semibold hover:underline"
                style={{ color: mainColor }}
              >
                {GOOGLE_CALENDAR_ID}
              </a>
            </p>
          </motion.div>
        </div>
      </main>

      {/* Consultation Dialog */}
      <ConsultationDialog
        isOpen={isConsultationOpen}
        onOpenChange={setIsConsultationOpen}
        title="Konsultasi Event Bimbelio"
        description="Tanyakan tentang webinar, live class, ujian coba, dan event eksklusif yang sesuai dengan kebutuhan belajar Anda. Tim kami siap membantu!"
        showStats={true}
        showDiscordOption={true}
        onContactSelect={(method) => {
          console.log('Selected contact method:', method);
          setIsConsultationOpen(false);
        }}
      />
    </>
  );
}
