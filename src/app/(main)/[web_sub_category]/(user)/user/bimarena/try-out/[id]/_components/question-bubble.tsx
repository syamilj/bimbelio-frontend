'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FileText, HelpCircle } from 'lucide-react';

interface QuestionBubbleProps {
  question?: string;
  questionNumber?: number;
  className?: string;
}

const QuestionBubble = ({
  question,
  questionNumber,
  className = '',
}: QuestionBubbleProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  if (!question) {
    return (
      <Card className="border-2 border-gray-200 rounded-3xl">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center justify-center h-32 text-gray-400">
            <div className="text-center">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Pertanyaan tidak tersedia</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card
        className="border-2 rounded-3xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ borderColor: `${mainColor}20` }}
      >
        <div
          className="h-1 w-full"
          style={{ backgroundColor: mainColor }}
        />

        <CardContent className="p-4 md:p-8">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-3xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <FileText
                  className="w-5 h-5 md:w-6 md:h-6"
                  style={{ color: mainColor }}
                />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  {questionNumber ? `Soal ${questionNumber}` : 'Pertanyaan'}
                </h3>
                <p className="text-sm text-gray-600">
                  Baca pertanyaan dengan teliti
                </p>
              </div>
            </div>

            {/* Question Content */}
            <div
              className="prose prose-sm md:prose-base max-w-none"
              style={
                {
                  '--tw-prose-headings': '#1f2937',
                  '--tw-prose-body': '#374151',
                  '--tw-prose-bold': mainColor,
                  '--tw-prose-links': mainColor,
                } as React.CSSProperties
              }
            >
              <BlocknoteEditor
                value={question}
                viewOnly
                className="question-content"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <style
        jsx
        global
      >{`
        .question-content {
          font-size: 16px;
          line-height: 1.7;
        }

        .question-content p {
          margin-bottom: 1rem;
        }

        .question-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 1.5rem 0;
        }

        .question-content ul,
        .question-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .question-content li {
          margin-bottom: 0.5rem;
        }

        .question-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .question-content th,
        .question-content td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .question-content th {
          background-color: ${mainColor}08;
          font-weight: 600;
          color: #374151;
        }

        .question-content code {
          background-color: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          color: ${mainColor};
        }

        .question-content blockquote {
          border-left: 4px solid ${mainColor};
          padding-left: 1rem;
          margin: 1.5rem 0;
          background-color: ${mainColor}08;
          border-radius: 0 8px 8px 0;
          padding: 1rem;
        }

        @media (max-width: 768px) {
          .question-content {
            font-size: 14px;
          }

          .question-content table {
            font-size: 12px;
          }

          .question-content th,
          .question-content td {
            padding: 8px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default QuestionBubble;
