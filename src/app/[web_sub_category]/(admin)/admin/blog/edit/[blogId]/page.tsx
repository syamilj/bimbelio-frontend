'use client';

import uploadFile from '@/_assest/icon/uploadDokumen.png';
import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { useGet, UseGetDataType } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn, getDateForInput } from '@/lib/utils';
import { IconPlus } from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { BlogPost, BlogStatusEnum, BlogTags } from '@/types/database';
import 'katex/dist/katex.min.css';
import { Check, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
//   ssr: false,
// });

const EditBlogAdmin = () => {
  const params = useParams();
  const blogId = Array.isArray(params?.blogId)
    ? params.blogId[0]
    : (params?.blogId ?? '');

  // const trpc = api.useUtils();

  // const { data: blog } = api.blog.getBlogByIdAdmin.useQuery(
  //   { id: blogId },
  //   { refetchOnWindowFocus: false },
  // );

  const {
    data: blog,
    isLoading,
    refetch,
  }: UseGetDataType<BlogPost> = useGet('/blog/getBlogByIdAdmin', {
    params: { id: blogId },
    useEffectDependencies: [blogId],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<File | undefined | string>();
  const [thumbnailName, setThumbnailName] = useState<string>('');
  const [publishedAt, setPublishedAt] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [value, setValue] = useState<string>('');
  const [status, setStatus] = useState<BlogStatusEnum>('DRAFT');
  const [isEditorPick, setIsEditorPick] = useState<boolean>(false);

  const [tagValue, setTagValue] = useState<{ open: boolean; title: string }[]>([
    { open: false, title: '' },
  ]);
  const [searchTag, setSearchTag] = useState<string>('');
  const [showDeleteIndex, setShowDeleteIndex] = useState<number | null>(null);

  // const { mutate: updateBlog } = api.blog.updateBlog.useMutation({
  //   onSuccess() {
  //     toaster({
  //       title: 'Success',
  //       condition: 'success',
  //       description: 'Blog berhasil diperbarui....',
  //       duration: 3000,
  //     });
  //     setLoading(false);
  //     trpc.blog.getBlogsAdmin.invalidate();
  //   },
  //   onError() {
  //     toaster({
  //       title: 'Error',
  //       condition: 'warning',
  //       description: 'Blog gagal diperbarui....',
  //       duration: 3000,
  //     });
  //     setLoading(false);
  //   },
  // });

  const { mutate: updateBlog } = useMutation('/blog/updateBlog', 'put', {
    payload: {
      id: blogId,
      title,
      description,
      value,
      tags,
      status,
      publishedAt: status === 'PUBLISH' ? publishedAt : null,
      isEditorPick,
    },
    onSuccess() {
      setLoading(false);
      refetch();
    },
    onError() {
      setLoading(false);
    },
  });

  // const { data: tagsData } = api.blog.getTags.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const { data: tagsData }: UseGetDataType<BlogTags[]> =
    useGet('/blog/getTags');

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description);
      setThumbnailName(blog.thumbnail);
      setStatus(blog.status);
      setPublishedAt(blog.publishedAt ? getDateForInput(blog.publishedAt) : '');
      setTags(blog.tags);
      setValue(blog.value);
      setIsEditorPick(blog.isEditorPick!);
      const tagDataValue = blog.tags.map((item) => {
        return {
          title: item,
          open: false,
        };
      });
      setTagValue(tagDataValue);
    }
  }, [blog]);

  useEffect(() => {
    const tagsStringArray = tagValue.map((item) => item.title);
    if (tagValue.length === 0) setTags([]);
    else setTags(tagsStringArray);
  }, [tagValue]);

  const showToast = (heading: string, description?: string) => {
    toaster({
      title: heading,
      condition: 'warning',
      description: description ? description : `Masukan ${heading} Blog....`,
      duration: 3000,
    });
    return;
  };

  const handleUpdate = async () => {
    if (title === '') return showToast('Title');
    if (description === '') return showToast('Description');
    if (status === 'PUBLISH' && !publishedAt)
      return showToast(
        'Published Date',
        'Pilih tanggal publikasi untuk blog yang akan dipublikasikan.',
      );
    setLoading(true);

    let newThumbnailUrl = blog?.thumbnail;

    if (thumbnail instanceof File) {
      const fileName = crypto.randomUUID();
      const imageName = blog?.thumbnail.split('/blog/')[1];

      // Delete old image
      if (imageName) {
        const deleteOldImage = await supabase.storage
          .from('img')
          .remove([`blog/${imageName}`]);

        if (deleteOldImage.error) {
          setLoading(false);
          return showToast('Thumbnail', 'Gagal menghapus thumbnail lama....');
        }
      }

      // Upload new image
      const { error } = await supabase.storage
        .from('img')
        .upload(`blog/${fileName}`, thumbnail);

      if (error) {
        setLoading(false);
        return showToast('Thumbnail', 'Gagal mengunggah thumbnail baru....');
      }

      newThumbnailUrl = `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/blog/${fileName}`;
    }

    updateBlog({
      payload: {
        thumbnail: newThumbnailUrl!,
      },
    });
  };

  const replaceLatexNotation = (content: string) => {
    return content
      .replace(/\\\[/g, '$$$')
      .replace(/\\\]/g, '$$$')
      .replace(/\\\(/g, '$$$')
      .replace(/\\\)/g, '$$$');
  };

  const remarkMathOptions = {
    singleDollarTextMath: false,
  };

  console.log('searchTag', searchTag);
  console.log('tags', tags);
  console.log('tagValue', tagValue);

  return (
    <div
      id="blog-admin"
      className="flex w-full flex-col gap-[2rem] bg-white p-[1rem]"
    >
      <h1 className="text-center text-[1.2rem] font-bold">
        Edit TutorSNBT Blog
      </h1>
      <div className="flex flex-col gap-[.5rem]">
        <InputText
          heading="Title"
          setValue={setTitle}
          value={title}
          placeholder="Title"
        />
        <InputTextarea
          heading="Description"
          setValue={setDescription}
          value={description}
          placeholder="Description"
        />
        <div className="max-w-[500px]">
          <UploadFile
            heading="Thumbnail Blog"
            contentText="Pilih thumbnail untuk diupload (.jpg, max 5MB)"
            inputId="thumbnailFile"
            buttonText="Upload Thumbnail"
            file={thumbnail}
            image
            setFile={setThumbnail}
            fileName={thumbnailName}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-[1rem]">
          <div
            id="name-file"
            className="flex w-full flex-col gap-[.5rem]"
          >
            <p>Status </p>
            <Select
              value={status}
              onValueChange={(value) =>
                value && setStatus(value as BlogStatusEnum)
              }
            >
              <SelectTrigger className="font-regular h-[45px] w-full rounded-[.5rem] border border-main-gray-input px-[1rem] text-black outline-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="PUBLISH">PUBLISH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div
            id="name-file"
            className="flex w-full flex-col gap-[.5rem]"
          >
            <p>Pilihan Editor</p>
            <Select
              value={isEditorPick ? 'true' : 'false'}
              onValueChange={(value) => setIsEditorPick(value === 'true')}
            >
              <SelectTrigger className="font-regular h-[45px] w-full rounded-[.5rem] border border-main-gray-input px-[1rem] text-black outline-none">
                <SelectValue placeholder="Pilihan Editor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {status === 'PUBLISH' && (
            <div
              id="name-file"
              className="flex w-full flex-col gap-[.5rem]"
            >
              <p>Published Date </p>
              <input
                type="datetime-local"
                className="font-regular h-[45px] w-full rounded-[.5rem] border border-main-gray-input px-[1rem] text-black outline-none"
                onChange={(e) => setPublishedAt(e.target.value)}
                value={publishedAt}
              />
            </div>
          )}
        </div>
        <div
          id="name-file"
          className="flex flex-col gap-[.5rem]"
        >
          <p>Tags (format : tags1, tags2, tags3)</p>
          {/* <input
            type="text"
            className="border border-main-gray-input rounded-[.5rem] outline-none text-black py-[.5rem] px-[1rem] w-full font-regular"
            placeholder={`Tags`}
            onChange={e => {
              const value = e.target.value.split(',').map(tag => tag.trim());
              if (value as string[]) {
                setTags(value);
              } else {
                toaster({
                  title: 'Tags',
                  condition: 'warning',
                  description: 'Format Tags di pisah dengan `,`',
                });
              }
            }}
            value={tags.join(', ')}
          /> */}
          <div className="flex items-start gap-[1rem]">
            {tagValue.map((tagVal, tagValIndex) => (
              <Popover
                open={tagVal.open}
                onOpenChange={() => {
                  setTagValue((prev) => {
                    return prev.map((item, tagIndex) => {
                      if (tagValIndex === tagIndex)
                        return { ...item, open: !item.open };
                      else return { ...item };
                    });
                  });
                }}
                key={tagValIndex}
              >
                <div
                  className="relative pb-[1.5rem]"
                  onMouseOver={() => setShowDeleteIndex(tagValIndex)}
                  onMouseLeave={() => setShowDeleteIndex(null)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={tagVal.open}
                      className="w-[200px] justify-between"
                    >
                      {tagVal.title !== '' ? tagVal.title : 'Select Blog Tag'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  {showDeleteIndex === tagValIndex && (
                    <div
                      className="absolute bottom-[0] right-0 cursor-pointer rounded-[.2rem] bg-red-100 px-[.5rem] py-[.1rem] text-[.75rem] text-red-800 duration-300 md:hover:bg-red-200"
                      onClick={() => {
                        setTagValue((prev) =>
                          prev.filter((_, i) => i !== tagValIndex),
                        );
                      }}
                    >
                      Hapus
                    </div>
                  )}
                </div>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Tags..."
                      value={searchTag}
                      onValueChange={(value) => setSearchTag(value)}
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {tagsData
                          ?.filter((item) => item.title.includes(searchTag))
                          .map((tag) => (
                            <CommandItem
                              key={tag.title}
                              value={tag.title}
                              onSelect={(currentValue) => {
                                setTagValue((prev) => {
                                  return prev.map((item, valIndex) => {
                                    if (tagValIndex === valIndex) {
                                      return {
                                        open: false,
                                        title: currentValue,
                                      };
                                    }
                                    return { ...item };
                                  });
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  tagVal.title === tag.title
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {tag.title}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ))}
            <div
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[.8rem] bg-blue-100 font-medium text-blue-600 duration-300 md:hover:bg-blue-200 md:hover:shadow-default md:active:bg-blue-100"
              onClick={() => {
                setTagValue((prev) => [...prev, { title: '', open: false }]);
              }}
            >
              <IconPlus w={15} />
            </div>
          </div>
        </div>
      </div>
      {/* <MDEditor
        value={value}
        height={'70vh'}
        onChange={(val) => {
          const processedValue = replaceLatexNotation(val ?? '');
          setValue(processedValue);
        }}
        previewOptions={{
          remarkPlugins: [[remarkMath, remarkMathOptions], remarkGfm],
          rehypePlugins: [rehypeKatex, rehypeRaw],
          className: 'ReactMarkdown',
        }}
      /> */}
      <BlocknoteEditor
        className="border rounded-lg p-8"
        value={value}
        onValueChange={(value) => {
          setValue(value);
        }}
      />
      <div className="h-[50px] w-full">
        {loading ? (
          <div className="flex h-[50px] w-full items-center justify-center rounded-[.8rem] bg-main-hover">
            <Spinner />
          </div>
        ) : (
          <div
            className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded-[.8rem] bg-main text-white duration-300 md:hover:bg-main-hover"
            onClick={handleUpdate}
          >
            Update Blog
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBlogAdmin;

// Komponen UploadFile, InputText, dan InputTextarea tetap sama seperti sebelumnya

const UploadFile = ({
  file,
  setFile,
  heading,
  buttonText,
  contentText,
  inputId,
  image,
  fileName,
}: any) => {
  const [previewHover, setPreviewHover] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    setPreviewImage('');
    if (image && file instanceof File) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };

      reader.readAsDataURL(file);
    } else if (fileName) {
      setPreviewImage(fileName);
    }
  }, [file, fileName, image]);

  return (
    <div className="relative">
      <p className="mb-[.5rem] ml-[.5rem] text-[.9rem] font-medium">
        {heading}
      </p>
      <input
        id={`${inputId}`}
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          e.target.files && setFile(e.target.files[0])
        }
        className="absolute right-0 top-0 h-0 w-0"
      />
      <div className="relative flex flex-col gap-[1rem] rounded-[1rem] border-2 border-dashed border-main-gray-input p-[1rem]">
        {!image ? (
          <>
            <div className="flex flex-col items-center gap-[.5rem] text-center">
              <Image
                src={uploadFile}
                alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
              />
              <p className="text-[.8rem] text-main-gray-text">
                {!file
                  ? `${contentText}`
                  : `${file instanceof File ? file.name : fileName}`}
              </p>
            </div>
            <button
              className="w-full rounded-[.5rem] border border-main-gray-input py-[.5rem] text-[.8rem] text-main-gray-text duration-300 hover:border-main hover:bg-main hover:text-white active:bg-main-hover"
              onClick={() => {
                document.getElementById(`${inputId}`)?.click();
              }}
            >
              {buttonText}
            </button>
          </>
        ) : (
          <>
            {!previewImage ? (
              <>
                <div className="flex flex-col items-center gap-[.5rem] text-center">
                  <Image
                    src={uploadFile}
                    alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
                  />
                  <p className="text-[.8rem] text-main-gray-text">
                    {!file
                      ? `${contentText}`
                      : `${file instanceof File ? file.name : fileName}`}
                  </p>
                </div>
                <button
                  className="w-full rounded-[.5rem] border border-main-gray-input py-[.5rem] text-[.8rem] text-main-gray-text duration-300 hover:border-main hover:bg-main hover:text-white active:bg-main-hover"
                  onClick={() => {
                    document.getElementById(`${inputId}`)?.click();
                  }}
                >
                  {buttonText}
                </button>
              </>
            ) : (
              <>
                <div className={`relative ${previewHover ? 'z-[4]' : 'z-[6]'}`}>
                  <Image
                    src={previewImage}
                    alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
                    layout="responsive"
                    width={500}
                    height={300}
                    onMouseOver={() => {
                      if (previewImage) {
                        setPreviewHover(true);
                      }
                    }}
                  />
                </div>
                <div className="absolute left-0 top-0 z-[5] flex h-full w-full items-center justify-center bg-[#ffffffc4] p-[1rem]">
                  <div
                    className="flex h-full w-full items-center justify-center"
                    onClick={() => {
                      document.getElementById(`${inputId}`)?.click();
                    }}
                    onMouseLeave={() => {
                      if (previewImage) {
                        setPreviewHover(false);
                      }
                    }}
                  >
                    <div className="flex flex-col items-center text-center text-main-gray-text">
                      <i className="bx bx-upload text-[1.5rem]" />
                      <p>Ganti Thumbnail</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const InputText = ({
  heading,
  placeholder,
  setValue,
  value,
}: {
  heading: string;
  placeholder: string;
  setValue: (value: string) => void;
  value: string;
}) => {
  return (
    <div
      id="name-file"
      className="flex flex-col gap-[.5rem]"
    >
      <p>{heading}</p>
      <input
        type="text"
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-black outline-none"
        placeholder={`${placeholder}`}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};

const InputTextarea = ({
  heading,
  placeholder,
  setValue,
  value,
}: {
  heading: string;
  placeholder: string;
  setValue: (value: string) => void;
  value: string;
}) => {
  return (
    <div
      id="name-file"
      className="flex flex-col gap-[.5rem]"
    >
      <p>{heading}</p>
      <textarea
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-black outline-none"
        placeholder={`${placeholder}`}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};
