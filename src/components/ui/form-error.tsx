import { AlertTriangle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-xl bg-destructive/20 p-3 text-sm text-destructive">
      <AlertTriangle size={20} />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
