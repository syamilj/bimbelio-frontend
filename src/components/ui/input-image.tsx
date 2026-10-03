import { cn } from '@/lib/utils';
import { UploadIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type InputImageProps = {
  onChange?: (image: File | undefined) => void;
  imageFile?: File | null;
  preview?: string;
  // showPreview?: boolean;
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
};

export function InputImage({
  onChange,
  preview,
  imageFile,
  // showPreview,
  placeholder,
  required,
  id,
  name,
}: InputImageProps) {
  const inputId = id || crypto.randomUUID();
  const [isHover, setIsHover] = useState<boolean>(false);
  const [PreviewImg, setPreviewImg] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!showPreview) setPreviewImg(null);
  // }, [showPreview]);

  useEffect(() => {
    if (!preview && !imageFile) setPreviewImg(null);
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const src = reader.result as string;
        setPreviewImg(src);
      };
      reader.readAsDataURL(imageFile);
    } else if (preview) setPreviewImg(preview);
  }, [preview, imageFile]);

  return (
    <div
      className="relative w-fit cursor-pointer"
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => {
        const input = document.getElementById(`${inputId}`) as HTMLInputElement;
        input.click();
      }}
    >
      <input
        id={`${inputId}`}
        name={name}
        type="file"
        className={cn('sr-only', 'top-0 bottom-0')}
        onChange={(e) => {
          const file = (e.target.files && e.target.files[0]) || undefined;
          if (onChange) onChange(file);
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const src = reader.result as string;
              setPreviewImg(src);
            };
            reader.readAsDataURL(file);
          }
        }}
        required={required}
      />
      <div
        className={cn(
          'relative flex h-[120px] w-[200px] items-center justify-center overflow-hidden rounded-sm border bg-gray-100 p-4',
          PreviewImg && 'h-fit w-fit max-w-[200px]',
        )}
      >
        {isHover && (
          <div
            className={cn(
              'absolute top-0 left-0 flex h-full w-full items-center justify-center bg-white/80',
              !PreviewImg && 'bg-gray-200',
            )}
          >
            <div className="flex flex-col items-center gap-[.5rem]">
              <UploadIcon className="text-gray-400" />
              <p className="font-medium text-gray-500/80">
                {placeholder ? placeholder : 'Upload Foto'}
              </p>
            </div>
          </div>
        )}
        {PreviewImg ? (
          <img
            src={PreviewImg}
            alt=""
          />
        ) : (
          <div className="flex flex-col items-center gap-[.5rem]">
            <UploadIcon className="text-gray-400" />
            <p className="font-medium text-gray-500/80">
              {placeholder ? placeholder : 'Upload Foto'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
