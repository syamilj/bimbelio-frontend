'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function PricingFaq() {
  const faqs = [
    {
      question: 'Apa itu sistem coin di TutorSNBT?',
      answer:
        'TutorSNBT menggunakan 5 jenis coin berbeda (Notes Coin, Chat Coin, Quiz Coin, Tryout Coin, dan Vision Coin) sebagai metode pembayaran internal untuk mengakses fitur-fitur interaktif. Setiap paket berlangganan memberikan jumlah coin bulanan yang berbeda untuk masing-masing jenis, dan Anda dapat membeli coin tambahan jika diperlukan.',
    },
    {
      question: 'Apa perbedaan antara kelima jenis coin?',
      answer:
        'Setiap jenis coin digunakan untuk fitur yang berbeda: Notes Coin untuk membuat catatan belajar, Chat Coin untuk berkomunikasi dengan AI Tutor, Quiz Coin untuk mengakses quiz interaktif, Tryout Coin untuk mengikuti tryout SNBT/UTBK, dan Vision Coin untuk menggunakan fitur AI Vision yang membantu menyelesaikan soal dari gambar.',
    },
    {
      question: 'Bagaimana cara menggunakan coin?',
      answer:
        'Coin akan otomatis digunakan saat Anda mengakses fitur yang memerlukan coin. Misalnya, saat Anda membuat notes baru, sistem akan mengurangi jumlah coin sesuai dengan biaya yang ditentukan untuk fitur tersebut berdasarkan paket berlangganan Anda.',
    },
    {
      question: 'Apakah coin yang tidak terpakai akan hangus?',
      answer:
        'Coin bonus dari paket berlangganan akan diperbarui setiap bulan dan tidak terakumulasi. Namun, coin yang Anda beli secara terpisah tidak akan hangus dan dapat digunakan kapan saja.',
    },
    {
      question: 'Apa perbedaan antara paket berlangganan dan paket bundle?',
      answer:
        'Paket berlangganan memberikan akses ke course dan dokumen dengan jumlah tertentu, serta bonus coin bulanan. Paket bundle dirancang untuk kebutuhan spesifik, seperti fokus pada persiapan ujian atau pembelajaran, dengan biaya coin yang lebih rendah untuk fitur-fitur tertentu.',
    },
    {
      question: 'Bagaimana cara berlangganan paket di TutorSNBT?',
      answer:
        "Anda dapat berlangganan dengan memilih paket yang sesuai, mengklik tombol 'Berlangganan Sekarang', dan mengikuti petunjuk pembayaran. Kami menerima berbagai metode pembayaran termasuk kartu kredit, transfer bank, dan e-wallet.",
    },
    {
      question: 'Apakah saya bisa mengubah paket berlangganan saya?',
      answer:
        'Ya, Anda dapat mengupgrade atau downgrade paket berlangganan Anda kapan saja. Perubahan akan berlaku pada periode penagihan berikutnya. Jika Anda mengupgrade, Anda akan mendapatkan akses ke fitur tambahan segera setelah pembayaran berhasil.',
    },
    {
      question: 'Bagaimana cara membeli coin tambahan?',
      answer:
        "Anda dapat membeli coin tambahan melalui halaman akun Anda. Pilih paket coin yang Anda inginkan, klik 'Beli Sekarang', dan ikuti petunjuk pembayaran. Coin akan segera tersedia setelah pembayaran berhasil.",
    },
    {
      question: 'Apakah ada pengembalian dana jika saya tidak puas?',
      answer:
        'Kami menawarkan jaminan uang kembali dalam 7 hari untuk pelanggan baru. Jika Anda tidak puas dengan layanan kami, Anda dapat meminta pengembalian dana penuh dalam 7 hari pertama berlangganan.',
    },
  ];

  return (
    <div className="mt-20">
      <div className="text-center mb-8">
        <div className="inline-block bg-main/10 text-main rounded-full px-4 py-1 text-sm font-medium mb-4">
          FAQ
        </div>
        <h2 className="text-3xl font-bold text-[#0a2540] mb-4">
          Pertanyaan Umum
        </h2>
        <p className="text-[#4a5568] max-w-2xl mx-auto">
          Temukan jawaban untuk pertanyaan yang sering diajukan tentang paket
          berlangganan dan sistem coin
        </p>
      </div>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-5"
          style={{
            background: `radial-gradient(circle, #0066ff 0%, transparent 70%)`,
            transform: 'translate(20%, -30%)',
          }}
        ></div>
        <Accordion
          type="single"
          collapsible
          className="w-full"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-100 last:border-0"
            >
              <AccordionTrigger className="text-left py-4 text-[#0a2540] font-medium hover:text-main hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#4a5568] pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
