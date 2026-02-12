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
      className="relative cursor-pointer w-fit"
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
          'w-[200px] h-[120px] border rounded-3xl p-4 bg-gray-100 flex justify-center items-center relative overflow-hidden',
          PreviewImg && 'w-fit h-fit max-w-[200px]',
        )}
      >
        {isHover && (
          <div
            className={cn(
              'absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white/80',
              !PreviewImg && 'bg-gray-200',
            )}
          >
            <div className="flex flex-col gap-[.5rem] items-center">
              <UploadIcon className="text-gray-400" />
              <p className="text-gray-500/80 font-medium">
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
          <div className="flex flex-col gap-[.5rem] items-center">
            <UploadIcon className="text-gray-400" />
            <p className="text-gray-500/80 font-medium">
              {placeholder ? placeholder : 'Upload Foto'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
