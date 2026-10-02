'use client';

import ConsultationDialog from '@/components/_shared/contact/consultation-dialog';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Bimbelio } from '@/components/ui/bim-brand';
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

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center justify-center gap-3 rounded-3xl border border-gray-100 bg-white px-6 py-3 shadow-sm">
              <Calendar
                className="h-5 w-5"
                style={{ color: mainColor }}
              />
              <span className="text-sm font-semibold text-gray-600">
                JADWAL EVENT
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
              Jadwal Event{' '}
              <Bimbelio
                className="inline"
                style={{ color: mainColor }}
              />
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
            <Card className="overflow-hidden rounded-3xl border-2">
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                }}
              />
              <CardHeader>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Jadwal Event Lengkap
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Semua event Bimbelio terupdate secara real-time
                    </p>
                  </div>
                  <a
                    href={`https://calendar.google.com/calendar/u/0?cid=${GOOGLE_CALENDAR_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="gap-2 rounded-3xl"
                      style={{ backgroundColor: mainColor, color: 'white' }}
                    >
                      <ExternalLink className="h-4 w-4" />
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
            <Card className="overflow-hidden rounded-3xl border-2">
              <CardContent className="p-0">
                <div className="overflow-hidden rounded-3xl bg-white">
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
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
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
                    <Card className="h-full overflow-hidden rounded-3xl border-2 transition-shadow hover:shadow-lg">
                      <div
                        className="h-2 w-full"
                        style={{ backgroundColor: event.color }}
                      />
                      <CardContent className="pt-4 sm:pt-6">
                        <div className="flex flex-col items-center space-y-2 text-center sm:space-y-3">
                          <div
                            className="rounded-3xl p-2 sm:p-3"
                            style={{
                              backgroundColor: event.bgColor.includes('blue')
                                ? '#dbeafe'
                                : event.bgColor.includes('emerald')
                                  ? '#d1fae5'
                                  : '#fef3c7',
                            }}
                          >
                            <EIcon
                              className="h-6 w-6 sm:h-8 sm:w-8"
                              style={{ color: event.color }}
                            />
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 sm:text-base">
                            {event.title}
                          </h4>
                          <p className="line-clamp-2 text-xs text-gray-600 sm:text-sm">
                            {event.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="mb-6 text-center text-xl font-bold text-gray-900">
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
                      <Card className="h-full overflow-hidden rounded-3xl border-2 transition-shadow hover:shadow-lg">
                        <div
                          className="h-2 w-full"
                          style={{ backgroundColor: mainColor }}
                        />
                        <CardContent className="pt-4 sm:pt-6">
                          <div className="flex flex-col items-center space-y-2 text-center sm:space-y-3">
                            <div
                              className="rounded-3xl p-2 sm:p-3"
                              style={{
                                backgroundColor: mainColor + '15',
                              }}
                            >
                              <BIcon
                                className="h-6 w-6 sm:h-8 sm:w-8"
                                style={{ color: mainColor }}
                              />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 sm:text-base">
                              {benefit.title}
                            </h4>
                            <p className="line-clamp-2 text-xs text-gray-600 sm:text-sm">
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
              className="overflow-hidden rounded-3xl border-2"
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
              <CardContent className="px-6 pt-10 pb-10 text-center">
                <h2 className="mb-3 text-3xl font-black text-gray-900">
                  Jangan Lewatkan Event Kami! 🚀
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-gray-600">
                  Subscribe kalender Bimbelio untuk mendapatkan notifikasi
                  langsung setiap ada webinar, live class, atau ujian coba baru.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    className="h-12 w-full gap-2 rounded-3xl px-8 font-semibold text-white sm:w-auto"
                    style={{ backgroundColor: mainColor }}
                    onClick={() => setIsConsultationOpen(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Konsultasi Gratis
                  </Button>
                  <a
                    href={`https://calendar.google.com/calendar/u/0?cid=${GOOGLE_CALENDAR_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="h-12 w-full gap-2 rounded-3xl border-2 px-8 font-semibold sm:w-auto"
                      style={{ color: mainColor, borderColor: mainColor }}
                    >
                      <Calendar className="h-4 w-4" />
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
            className="mt-12 space-y-2 text-center text-sm text-gray-500"
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
