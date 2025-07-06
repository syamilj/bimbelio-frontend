import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import {
  IconRevolusi1,
  IconRevolusi2,
  IconRevolusi3,
  IconRevolusi4,
} from '@/styles/icon';

import { ImageBahanAjar } from '@/_assest/homepage/Revolusi/BahanAjar';
import { ImageChatAI } from '@/_assest/homepage/Revolusi/Chat';
import { ImageNotes } from '@/_assest/homepage/Revolusi/Notes';
import { ImageQuiz } from '@/_assest/homepage/Revolusi/Quiz';

const LearningRevolutions = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const revolusiBelajar = [
    {
      icon: <IconRevolusi1 />,
      heading: 'Interactive Materials',
      description:
        'Dapatkan materi, soal, dan video yang bisa kamu tandai dan tanyakan sesuai kebutuhan!',
      image: <ImageBahanAjar />,
      highlights: [
        'Materi Interaktif',
        'Soal Terintegrasi',
        'Video Learning',
      ],
    },
    {
      icon: <IconRevolusi2 />,
      heading: 'Chat & Vision',
      description:
        'Chat Bimbelio AI untuk penjelasan dan analisis materi dalam bentuk apapun secara real-time!',
      image: <ImageChatAI />,
      highlights: ['AI Chat 24/7', 'Vision Analysis', 'Real-time Help'],
    },
    {
      icon: <IconRevolusi3 />,
      heading: 'Note Collection',
      description:
        'Gunakan fitur Note yang disertai AI untuk membantu mencatat dan mengatur informasi penting!',
      image: <ImageNotes />,
      highlights: ['Smart Notes', 'AI Assistant', 'Organization Tools'],
    },
    {
      icon: <IconRevolusi4 />,
      heading: 'Generate Quiz',
      description:
        'Generate Quiz pilihan ganda maupun esai secara otomatis dari material yang ada!',
      image: <ImageQuiz />,
      highlights: ['Auto Generate', 'Multiple Choice', 'Essay Questions'],
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: mainColor }}>
          Revolusi Persiapan Belajar dengan AI!
        </h2>
        <p className="text-gray-600">Bagaimana cara belajar dengan AI membantu Kamu?</p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {revolusiBelajar.map((item, index) => (
          <Card
            key={index}
            className="rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Content */}
                <div className="space-y-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <div style={{ color: mainColor }}>{item.icon}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900">{item.heading}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {item.highlights.map((highlight, hIndex) => (
                      <span
                        key={hIndex}
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${mainColor}10`,
                          color: mainColor,
                        }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className="hidden md:block">
                  <div style={{ color: mainColor }}>{item.image}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LearningRevolutions;
