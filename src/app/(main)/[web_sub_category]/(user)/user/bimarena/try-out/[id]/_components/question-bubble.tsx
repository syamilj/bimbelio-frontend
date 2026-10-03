'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { HelpCircle } from 'lucide-react';

interface QuestionBubbleProps {
  question?: string;
  className?: string;
}

const QuestionBubble = ({ question, className = '' }: QuestionBubbleProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0066FF';

  if (!question) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 p-6">
        <div className="text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Pertanyaan tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className="prose prose-sm md:prose-base max-w-none"
        style={
          {
            '--tw-prose-headings': '#0f172a',
            '--tw-prose-body': '#334155',
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

      <style
        jsx
        global
      >{`
        .question-content {
          font-size: 15px;
          line-height: 1.65;
        }

        .option-text {
          font-size: 14px !important;
          line-height: 1.5 !important;
        }

        .option-text p {
          font-size: 14px !important;
          margin-bottom: 0 !important;
        }

        @media (min-width: 768px) {
          .question-content {
            font-size: 16px;
            line-height: 1.7;
          }

          .option-text {
            font-size: 15px !important;
          }

          .option-text p {
            font-size: 15px !important;
          }
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

        .question-content table {
          font-size: 13px;
        }

        .question-content th,
        .question-content td {
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default QuestionBubble;
