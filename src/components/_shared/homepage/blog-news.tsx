'use client';

import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';

const BlogNews = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const featuredArticle = {
    id: 1,
    title: 'Strategi Jitu Menghadapi UTBK 2024: Tips dari Alumni yang Berhasil',
    excerpt:
      'Panduan lengkap dan strategi terbukti untuk meraih skor tinggi dalam UTBK 2024. Pelajari dari pengalaman alumni yang berhasil masuk PTN favorit.',
    author: 'Tim Bimbelio',
    date: '15 Desember 2024',
    readTime: '8 menit',
    views: '2.1K',
    category: 'Tips & Strategi',
    image: '/api/placeholder/600/300',
    featured: true,
  };

  const articles = [
    {
      id: 2,
      title: 'Panduan Lengkap Soal TKP CPNS 2024',
      excerpt:
        'Pelajari tipe-tipe soal TKP dan strategi menjawab yang efektif untuk menghadapi tes CPNS 2024.',
      author: 'Dr. Sarah Amelia',
      date: '12 Desember 2024',
      readTime: '6 menit',
      views: '1.8K',
      category: 'CPNS',
      image: '/api/placeholder/400/200',
      featured: false,
    },
    {
      id: 3,
      title: 'Cara Menggunakan AI untuk Belajar Lebih Efektif',
      excerpt:
        'Manfaatkan kekuatan AI dalam pembelajaran untuk meningkatkan efisiensi dan hasil belajar Kamu.',
      author: 'Prof. Ahmad Hidayat',
      date: '10 Desember 2024',
      readTime: '5 menit',
      views: '3.2K',
      category: 'Teknologi',
      image: '/api/placeholder/400/200',
      featured: false,
    },
    {
      id: 4,
      title: 'Analisis Soal Matematika UTBK 5 Tahun Terakhir',
      excerpt:
        'Trend dan pola soal matematika UTBK dari 2019-2023 untuk memprediksi soal 2024.',
      author: 'M. Rifki, S.Si',
      date: '8 Desember 2024',
      readTime: '10 menit',
      views: '2.7K',
      category: 'Analisis',
      image: '/api/placeholder/400/200',
      featured: false,
    },
    {
      id: 5,
      title: 'Success Story: Dari Nilai Pas-pasan ke Lolos STAN',
      excerpt:
        'Kisah inspiratif seorang siswa yang berhasil mengubah nasib dan lolos STAN dengan bantuan AI.',
      author: 'Maya Sari',
      date: '5 Desember 2024',
      readTime: '7 menit',
      views: '4.1K',
      category: 'Success Story',
      image: '/api/placeholder/400/200',
      featured: false,
    },
  ];

  const categories = [
    {
      name: 'Tips & Strategi',
      count: 24,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    { name: 'CPNS', count: 18, icon: <Users className="w-4 h-4" /> },
    { name: 'UTBK/PTN', count: 32, icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Success Story', count: 15, icon: <Award className="w-4 h-4" /> },
  ];

  const stats = [
    { label: 'Total Artikel', value: '150+', color: mainColor },
    { label: 'Pembaca Aktif', value: '25K+', color: '#10B981' },
    { label: 'Expert Writers', value: '20+', color: '#F59E0B' },
    { label: 'Update Mingguan', value: '3x', color: '#8B5CF6' },
  ];

  return (
    <section
      id="blog"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <BookOpen className="w-4 h-4" />
              ARTIKEL & BERITA
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <AnimatedGradientText>
              Tips & Insight untuk Kesuksesanmu
            </AnimatedGradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Temukan tips, strategi, dan insight terbaru dari para ahli untuk
            membantu persiapan ujianmu
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Article */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border-2 border-gray-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-full overflow-hidden">
                    <Image
                      src="/api/placeholder/600/300"
                      alt={featuredArticle.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                        style={{ backgroundColor: mainColor }}
                      >
                        FEATURED
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span
                          className="px-2 py-1 rounded-lg font-medium"
                          style={{
                            backgroundColor: `${mainColor}15`,
                            color: mainColor,
                          }}
                        >
                          {featuredArticle.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {featuredArticle.date}
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {featuredArticle.author}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredArticle.readTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {featuredArticle.views}
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className="mt-6 group flex items-center gap-2 px-6 py-3 rounded-3xl font-bold text-white shadow-lg transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      >
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full overflow-hidden border-2 border-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 group">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src="/api/placeholder/400/200"
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-bold text-white shadow-lg"
                          style={{ backgroundColor: `${mainColor}dd` }}
                        >
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex-1 space-y-3">
                        <h4 className="font-bold text-gray-900 leading-tight line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {article.author}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {article.date}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-medium p-0 h-auto hover:bg-transparent group"
                            style={{ color: mainColor }}
                          >
                            Baca
                            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Categories */}
            <Card className="border-2 border-gray-100 rounded-3xl shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <BookOpen
                      className="w-3 h-3"
                      style={{ color: mainColor }}
                    />
                  </div>
                  Kategori
                </h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-3xl hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div style={{ color: mainColor }}>{category.icon}</div>
                        <span className="font-medium text-gray-700 group-hover:text-gray-900">
                          {category.name}
                        </span>
                      </div>
                      <span
                        className="px-2 py-1 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: `${mainColor}15`,
                          color: mainColor,
                        }}
                      >
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card
              className="border-2 rounded-3xl shadow-lg overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
                borderColor: `${mainColor}20`,
              }}
            >
              <CardContent className="p-6 text-center">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: mainColor }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Newsletter</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Dapatkan tips dan artikel terbaru langsung di inbox Kamu
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="w-full py-3 rounded-3xl font-bold text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    Berlangganan
                  </Button>
                </motion.div>
                <p className="text-xs text-gray-500 mt-3">
                  📧 Gratis • 🚫 No Spam • ✉️ 2x seminggu
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="px-8 py-4 rounded-3xl font-bold text-white shadow-lg transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              Lihat Semua Artikel
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogNews;
