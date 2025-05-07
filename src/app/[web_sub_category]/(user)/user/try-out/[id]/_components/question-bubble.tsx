import ReactMarkdown from '@/components/ui/react-markdown';
import { replaceLatexNotation } from '@/lib/utils';
import 'katex/dist/katex.min.css';

interface QuestionBubbleProps {
  question: string;
}

const QuestionBubble = ({ question }: QuestionBubbleProps) => {
  return (
    <div className="mb-6 flex items-center gap-x-4 text-[1rem]">
      <ReactMarkdown
        className="ReactMarkdown prose bg-transparent"
        value={replaceLatexNotation(question)}
      />
    </div>
  );
};

export default QuestionBubble;
