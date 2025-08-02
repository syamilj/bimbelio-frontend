import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const FeatureCard = ({
  isLoading,
  isLoadingObjective,
  bulletPoints,
  onClick,
  onClickObjective,
  buttonText,
  subtext,
  title,
}: {
  isLoading: boolean;
  isLoadingObjective?: boolean;
  bulletPoints: string[];
  onClick: () => void;
  onClickObjective?: () => void;
  buttonText: string;
  subtext: string;
  title: string;
}) => {
  return (
    <div className="mx-auto flex h-full w-[90%] max-w-120 flex-col justify-center">
      <p className="text-2xl font-bold tracking-tight">{title}</p>
      <p className="my-2 text-lg font-normal text-gray-500">{subtext}</p>

      <ul>
        {bulletPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>

      <Button
        className="mt-4 md:mt-6"
        disabled={isLoading}
        onClick={onClick}
      >
        {isLoading && <Spinner />}
        {buttonText}
      </Button>
      {onClickObjective && (
        <Button
          className="mt-4 md:mt-6"
          disabled={isLoadingObjective}
          onClick={onClickObjective}
        >
          {isLoadingObjective && <Spinner />}
          {buttonText} Objective
        </Button>
      )}
      {}
    </div>
  );
};
export default FeatureCard;
