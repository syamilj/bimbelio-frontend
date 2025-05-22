import BlocknoteEditor from '@/components/ui/blocknote-editor';
import 'katex/dist/katex.min.css';

interface QuestionBubbleProps {
  question: string;
}

const QuestionBubble = ({ question }: QuestionBubbleProps) => {
  return (
    <div className="mb-6 flex items-center gap-x-4 text-[1rem]">
      <BlocknoteEditor
        value={question}
        viewOnly
      />
    </div>
  );
};

export default QuestionBubble;
