'use client';

import Logo from '@/_assets/logo.png';
import { Printer } from 'lucide-react';
import { useRef } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

// Dummy Data
const dummyData = {
  student: {
    name: 'Rahmat Mahendra',
    email: 'rahmat.mahendra@email.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Merdeka No. 123, Jakarta',
    program: 'Program UTBK 2024',
  },
  attendance: {
    hadir: 30,
    izin: 5,
    alpa: 2,
  },
  bimArenaData: [
    { name: 'BimArena #1', value: 600 },
    { name: 'BimArena #2', value: 545 },
    { name: 'BimArena #3', value: 615 },
  ],
  bimQuizData: [
    { subject: 'Pengetahuan & Pemahaman Umum', count: 0 },
    { subject: 'Penalaran Umum', count: 3 },
    { subject: 'Pengetahuan Membaca & Menulis', count: 2 },
    { subject: 'Pengetahuan Kuantitatif', count: 0 },
    { subject: 'Literasi Bahasa Indonesia', count: 0 },
    { subject: 'Literasi Bahasa Inggris', count: 7 },
    { subject: 'Penalaran Matematika', count: 4 },
  ],
  reportTryOut: [
    {
      subject: 'Pengetahuan & Pemahaman Umum',
      to1: 310,
      to2: 310,
      to3: 301,
    },
    { subject: 'Penalaran Umum', to1: 310, to2: 310, to3: 301 },
    { subject: 'Pengetahuan Membaca & Menulis', to1: 310, to2: 310, to3: 301 },
    { subject: 'Pengetahuan Kuantitatif', to1: 310, to2: 310, to3: 301 },
    {
      subject: 'Literasi Bahasa Indonesia',
      to1: 310,
      to2: 310,
      to3: 301,
    },
    { subject: 'Literasi Bahasa Inggris', to1: 310, to2: 310, to3: 301 },
    { subject: 'Penalaran Matematika', to1: 310, to2: 310, to3: 301 },
  ],
  reportQuiz: [
    {
      subject: 'Pengetahuan & Pemahaman Umum',
      q1: 300,
      q2: 310,
      q3: 200,
      q4: 310,
      q5: 301,
    },
    { subject: 'Penalaran Umum', q1: 300, q2: 310, q3: 200, q4: 310, q5: 301 },
    {
      subject: 'Pengetahuan Membaca & Menulis',
      q1: 300,
      q2: 310,
      q3: 200,
      q4: 310,
      q5: 301,
    },
    {
      subject: 'Pengetahuan Kuantitatif',
      q1: 300,
      q2: 310,
      q3: 200,
      q4: 310,
      q5: 301,
    },
    {
      subject: 'Literasi Bahasa Indonesia',
      q1: 300,
      q2: 310,
      q3: 200,
      q4: 310,
      q5: 301,
    },
    {
      subject: 'Literasi Bahasa Inggris',
      q1: 300,
      q2: 310,
      q3: 200,
      q4: 310,
      q5: 301,
    },
    {
      subject: 'Penalaran Matematika',
      q1: 300,
      q2: 310,
      q3: 200,
      q4: 310,
      q5: 301,
    },
  ],
  evaluation: {
    prediction: 680,
    passingGrade: 650,
    status: 'Lolos',
    message: 'Tetap semangat ya kamu pinter asil sumpah',
    notes:
      'Anak nya baik, rajin menabung, tidak sombong, dan peduli terhadap sesama, cakep lagi',
  },
};

const pieChartColors = ['#3B82F6', '#10B981', '#F59E0B'];

// Subject abbreviations
const subjectAbbreviations: { [key: string]: string } = {
  'Pengetahuan & Pemahaman Umum': 'PPU',
  'Penalaran Umum': 'PU',
  'Pengetahuan Membaca & Menulis': 'PMM',
  'Pengetahuan Kuantitatif': 'PK',
  'Literasi Bahasa Indonesia': 'LBI',
  'Literasi Bahasa Inggris': 'LBing',
  'Penalaran Matematika': 'PM',
};

export default function ReportPage() {
  const reportRef = useRef<HTMLDivElement>(null);

  const mainColor = '#006CFA';
  const secondaryColor = '#0091FF';

  const handlePrint = () => {
    window.print();
  };

  const handleTest = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    }
    Notification.requestPermission()
      .then(function (permission) {
        if (permission === 'granted') {
          new Notification('Hello! This is a test notification.', {
            body: 'This notification was triggered by the print button.',
            icon: Logo.src,
          });
          // console.log(notification);
          // notification.onclick = function () {
          //   window.open('https://bimbelio.com', '_blank');
          // };
        }
        console.log('Notification permission status:', permission);
      })
      .catch((error) => {
        console.error('Error requesting notification permission:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          <Printer size={20} />
          Print
        </button>
        <button
          onClick={() => handleTest()}
          className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          <Printer size={20} />
          Test
        </button>
      </div>

      <div
        ref={reportRef}
        className="space-y-0 bg-white max-w-7xl mx-auto"
      >
        {/* Section A: Data Siswa */}
        <section
          className="space-y-4 pl-4 bg-white py-8 px-8 page-break-inside-avoid"
          style={{ borderLeft: `4px solid ${mainColor}` }}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2
                className="text-3xl font-bold"
                style={{ color: mainColor }}
              >
                Bimbelio
              </h2>
              <span
                className="text-3xl font-bold"
                style={{ color: mainColor }}
              >
                2026
              </span>
            </div>
            <h3
              className="text-2xl font-bold"
              style={{ color: mainColor }}
            >
              A. Data Siswa
            </h3>
          </div>

          <div className="space-y-2 text-gray-800">
            <p>
              <span className="font-bold">Nama :</span> {dummyData.student.name}
            </p>
            <p>
              <span className="font-bold">Email :</span>{' '}
              {dummyData.student.email}
            </p>
            <p>
              <span className="font-bold">No.Hp :</span>{' '}
              {dummyData.student.phone}
            </p>
            <p>
              <span className="font-bold">Kontak Wali :</span>{' '}
              {dummyData.student.address}
            </p>
            <p>
              <span className="font-bold">Program :</span>{' '}
              {dummyData.student.program}
            </p>
          </div>

          {/* Programs */}
          <div className="mt-4 flex gap-4">
            <div
              className="flex-1 rounded-2xl p-4 text-white"
              style={{
                background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <h4 className="mb-2 font-bold">Pilihan 1</h4>
              <p className="text-sm font-bold">
                FIKOM - Universitas Padjadjaran
              </p>
              <p className="text-2xl font-bold">650</p>
              <p className="text-xs text-gray-200">[Estimated passing Grade]</p>
              <p className="text-xs text-gray-200">Kuota 150</p>
            </div>
            <div
              className="flex-1 rounded-2xl p-4 text-white"
              style={{
                background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <h4 className="mb-2 font-bold">Pilihan 2</h4>
              <p className="text-sm font-bold">
                Forensik - Universitas Indonesia
              </p>
              <p className="text-2xl font-bold">750</p>
              <p className="text-xs text-gray-200">[Estimated passing Grade]</p>
              <p className="text-xs text-gray-200">Kuota 100</p>
            </div>
          </div>
        </section>

        {/* Section B: Tracker */}
        <section
          className="space-y-4 pl-4 bg-gradient-to-b from-white to-gray-50 py-6 px-8 page-break-inside-avoid"
          style={{ borderLeft: `4px solid ${mainColor}` }}
        >
          <h3
            className="text-2xl font-bold"
            style={{ color: mainColor }}
          >
            B. Tracker - Effort dan Kedisiplinan Siswa
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div
              className="rounded-3xl p-6 text-white shadow-lg"
              style={{
                background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <h4 className="mb-4 font-bold text-center text-lg">
                Jumlah Kehadiran
              </h4>
              <ResponsiveContainer
                width="100%"
                height={200}
              >
                <PieChart>
                  <Pie
                    data={[
                      dummyData.attendance.hadir,
                      dummyData.attendance.izin,
                      dummyData.attendance.alpa,
                    ].map((val, idx) => ({
                      name: ['Hadir', 'Izin', 'Alpa'][idx],
                      value: val,
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieChartColors.map((color, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={color}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center text-xs space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Hadir - {dummyData.attendance.hadir}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Izin - {dummyData.attendance.izin}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Alpa - {dummyData.attendance.alpa}</span>
                </div>
              </div>
            </div>

            {/* BimArena & BimQuiz Stats */}
            <div className="space-y-4">
              <div
                className="rounded-3xl p-6 text-white shadow-lg"
                style={{
                  background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <h4 className="mb-6 font-bold text-center text-lg">
                  Jumlah Pengerjaan BimArena Quiz
                </h4>
                <div className="flex justify-around items-center">
                  {dummyData.bimArenaData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mb-2 shadow-lg">
                        <span
                          className="text-3xl font-bold"
                          style={{ color: mainColor }}
                        >
                          {item.value}
                        </span>
                      </div>
                      <p className="text-xs text-center">Volume #{idx + 1}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-3xl p-6 text-white shadow-lg"
                style={{
                  background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <h4 className="mb-4 font-bold text-center text-lg">
                  Jumlah Pengerjaan BimArena Tryout
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {dummyData.bimQuizData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs flex-1">{item.subject}</span>
                      <span
                        className="bg-yellow-400 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        style={{ color: mainColor }}
                      >
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section C: Report Try Out */}
        <section
          className="space-y-4 pl-4 bg-white py-6 px-8 page-break-inside-avoid"
          style={{ borderLeft: `4px solid ${mainColor}` }}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2
                className="text-3xl font-bold"
                style={{ color: mainColor }}
              >
                Bimbelio
              </h2>
              <span
                className="text-3xl font-bold"
                style={{ color: mainColor }}
              >
                2026
              </span>
            </div>
            <h3
              className="text-2xl font-bold"
              style={{ color: mainColor }}
            >
              C. Report BimArena Tryout
            </h3>
          </div>

          <div className="space-y-4">
            <div className="inline-block bg-black text-white px-4 py-2 rounded-full font-bold text-sm">
              BimArena Tryout
            </div>
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr
                    className="text-white font-bold"
                    style={{
                      background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <th className="px-4 py-3 text-left border-b border-blue-400">
                      Tryout
                    </th>
                    <th className="px-4 py-3 text-center bg-yellow-400 text-black">
                      Total
                    </th>
                    {dummyData.reportTryOut.map((item) => (
                      <th
                        key={item.subject}
                        className="px-4 py-3 text-center bg-yellow-400 text-black"
                      >
                        {subjectAbbreviations[item.subject] || item.subject}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['to1', 'to2', 'to3'].map((toKey, idx) => (
                    <tr
                      key={toKey}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td
                        className="px-4 py-3 font-bold text-white text-sm border-b border-blue-400"
                        style={{
                          background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
                        }}
                      >
                        TO#{idx + 1}
                      </td>
                      <td className="px-4 py-3 text-center font-bold border border-gray-200">
                        746
                      </td>
                      {dummyData.reportTryOut.map((item) => (
                        <td
                          key={`${toKey}-${item.subject}`}
                          className="px-4 py-3 text-center font-bold border border-gray-200"
                        >
                          {item[toKey as keyof typeof item]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section D: Report Quiz */}
        <section
          className="space-y-4 pl-4 bg-white py-6 px-8 page-break-inside-avoid"
          style={{ borderLeft: `4px solid ${mainColor}` }}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2
                className="text-3xl font-bold"
                style={{ color: mainColor }}
              >
                Bimbelio
              </h2>
              <span
                className="text-3xl font-bold"
                style={{ color: mainColor }}
              >
                2026
              </span>
            </div>
            <h3
              className="text-2xl font-bold"
              style={{ color: mainColor }}
            >
              D. Report BimArena Quiz
            </h3>
          </div>

          {Array.from({ length: 2 }).map((_, idx) => (
            <div className="space-y-4">
              <div className="inline-block bg-black text-white px-4 py-2 rounded-full font-bold text-sm">
                Volume #{idx + 1}
              </div>
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr
                      className="text-white font-bold"
                      style={{
                        background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      <th className="px-4 py-3 text-left  border-b border-blue-400">
                        Sub Tes
                      </th>
                      <th className="px-4 py-3 text-center bg-yellow-400 text-black">
                        Quiz#1
                      </th>
                      <th className="px-4 py-3 text-center bg-yellow-400 text-black">
                        Quiz#2
                      </th>
                      <th className="px-4 py-3 text-center bg-yellow-400 text-black">
                        Quiz#3
                      </th>
                      <th className="px-4 py-3 text-center bg-yellow-400 text-black">
                        Quiz#4
                      </th>
                      <th className="px-4 py-3 text-center bg-yellow-400 text-black">
                        Quiz#5
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyData.reportQuiz.map((row, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td
                          className="px-4 py-3 font-bold text-white text-sm border-b border-blue-400"
                          style={{
                            background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          {subjectAbbreviations[row.subject] || row.subject}
                        </td>
                        <td className="px-4 py-3 text-center font-bold border border-gray-200">
                          {row.q1}
                        </td>
                        <td className="px-4 py-3 text-center font-bold border border-gray-200">
                          {row.q2}
                        </td>
                        <td className="px-4 py-3 text-center font-bold border border-gray-200">
                          {row.q3}
                        </td>
                        <td className="px-4 py-3 text-center font-bold border border-gray-200">
                          {row.q4}
                        </td>
                        <td className="px-4 py-3 text-center font-bold border border-gray-200">
                          {row.q5}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* Section E: Evaluasi */}
        <section
          className="space-y-6 pl-4 bg-white py-8 px-8 page-break-inside-avoid"
          style={{ borderLeft: `4px solid ${mainColor}` }}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2
                className="text-3xl font-bold"
                style={{ color: mainColor }}
              >
                Bimbelio
              </h2>
              <span
                className="text-3xl font-bold"
                style={{ color: mainColor }}
              >
                2026
              </span>
            </div>
            <h3
              className="text-2xl font-bold"
              style={{ color: mainColor }}
            >
              E. Evaluasi
            </h3>
          </div>

          {/* Prediksi UTBK */}
          <div className="space-y-4">
            <div className="inline-block bg-black text-white px-4 py-2 rounded-full font-bold text-sm">
              Prediksi nilai UTBK
            </div>

            {/* Passing Grade Box */}
            <div
              className="rounded-3xl p-6 text-white"
              style={{
                background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <div className="text-center">
                <h4 className="text-4xl font-bold mb-2">
                  {dummyData.evaluation.status} Passing Grade
                </h4>
                <p className="text-lg italic">
                  "{dummyData.evaluation.message}"
                </p>
              </div>
            </div>
          </div>

          {/* Catatan */}
          <div className="space-y-3">
            <div className="inline-block bg-black text-white px-4 py-2 rounded-full font-bold text-sm">
              Catatan
            </div>
            <div
              className="rounded-2xl p-4 text-gray-700 border-2 min-h-24"
              style={{ borderColor: mainColor }}
            >
              <p>{dummyData.evaluation.notes}</p>
            </div>
          </div>

          {/* Signature Lines */}
          <div className="pt-8 grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="text-center">
                <p
                  className="text-sm font-bold mb-8"
                  style={{ color: mainColor }}
                >
                  Orang Tua Wali
                </p>
                <div
                  style={{ borderTop: `2px solid ${mainColor}` }}
                  className="pt-2 text-xs text-gray-600"
                >
                  (Tanda Tangan)
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="text-center">
                <p
                  className="text-sm font-bold mb-8"
                  style={{ color: mainColor }}
                >
                  Tim Kurikulum
                </p>
                <div
                  style={{ borderTop: `2px solid ${mainColor}` }}
                  className="pt-2 text-xs text-gray-600"
                >
                  (Tanda Tangan)
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
