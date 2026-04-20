import ReactMarkdown from '@/components/ui/react-markdown';
import { IconInfo, IconSuccess, IconWrong } from '@/styles/icon';
import 'katex/dist/katex.min.css';

const Feedback = ({
  correctResponse,
  wrongResponse,
  moreInfo,
}: {
  correctResponse?: string | null;
  wrongResponse?: string | null;
  moreInfo?: string | null;
}) => {
  return (
    <div className="space-y-4">
      {correctResponse && (
        <div className="rounded-3xl bg-[#E1F7EB] p-4">
          <h4 className="mb-2 flex items-center text-sm font-semibold text-[#006426]">
            <IconSuccess className="mr-2 text-[#00A853]" />
            Jawaban Benar
          </h4>
          <ReactMarkdown value={correctResponse} />
        </div>
      )}
      {wrongResponse && (
        <div className="rounded-3xl bg-[#FEE4E9] p-4">
          <h4 className="mb-2 flex items-center text-sm font-semibold text-[#8D1145]">
            <IconWrong className="mr-2 text-[#DA2850]" />
            Jawaban Salah
          </h4>

          <ReactMarkdown value={wrongResponse} />
        </div>
      )}
      {moreInfo && (
        <div className="rounded-3xl bg-[#E1F2FF] p-4">
          <h4 className="mb-2 flex items-center text-sm font-semibold text-[#2236D1]">
            <IconInfo className="mr-2 text-[#0091FF]" />
            More info
          </h4>

          <ReactMarkdown value={moreInfo} />
        </div>
      )}
    </div>
  );
};

export default Feedback;
