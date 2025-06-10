'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { InputImage } from '@/components/ui/input-image';
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
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { IconPlus } from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { BlogStatusEnum, BlogTags } from '@/types/database';
import 'katex/dist/katex.min.css';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import BlogEditor from '../../../../../../components/ui/blog-editor';

const AddBlogAdmin = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<File | undefined>();
  const [publishedAt, setPublishedAt] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [value, setValue] = useState<string>('');
  const [status, setStatus] = useState<BlogStatusEnum>('DRAFT');
  const [isEditorPick, setIsEditorPick] = useState<boolean>(false);

  // const [open, setOpen] = useState<boolean>(false)
  const [tagValue, setTagValue] = useState<{ open: boolean; title: string }[]>([
    { open: false, title: '' },
  ]);
  const [searchTag, setSearchTag] = useState<string>('');
  const [showDeleteIndex, setShowDeleteIndex] = useState<number | null>(null);

  const { mutate: createBlog, isLoading: isDeleting } = useMutation(
    '/blog/createBlog',
    'post',
    {
      payload: {
        title,
        description,
        value,
        tags,
        status,
        publishedAt: status === 'SCHEDULED' ? publishedAt : null,
        isEditorPick,
      },
      onSuccess() {
        localStorage.removeItem('temporary-add-blog');
        setValue('');
        setTitle('');
        setDescription('');
        setThumbnail(undefined);
        setLoading(false);
      },
      onError() {
        setLoading(false);
      },
    },
  );

  // const { data: tagsData } = api.blog.getTags.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const { data: tagsData } = useGet<BlogTags[]>('/blog/getTags');

  useEffect(() => {
    const blogSavedString = localStorage.getItem('temporary-add-blog');
    if (blogSavedString) {
      const blogSaved = JSON.parse(blogSavedString);
      setValue(blogSaved.value);
      setTitle(blogSaved.title);
      setDescription(blogSaved.description);
      setTagValue(blogSaved.tagValue);
    }
  }, []);

  useEffect(() => {
    const saveData = {
      title,
      description,
      value,
      tagValue,
    };
    let check = false;
    tagValue.forEach((item) => {
      if (item.title === '') check = true;
    });
    if (
      title !== '' ||
      description !== '' ||
      value !== '' ||
      (tagValue.length > 0 && !check)
    ) {
      localStorage.setItem('temporary-add-blog', JSON.stringify(saveData));
    }
  }, [thumbnail, title, description, value, tagValue]);

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

  const handlePost = async () => {
    if (title === '') return showToast('Title');
    if (description === '') return showToast('Description');
    if (!thumbnail) return showToast('Thumbnail', 'Upload Thumbnail....');
    if (status === 'SCHEDULED' && !publishedAt)
      return showToast(
        'Published Date',
        'Pilih tanggal publikasi untuk blog terjadwal.',
      );
    setLoading(true);
    const fileName = crypto.randomUUID();
    const { data, error } = await supabase.storage
      .from('img')
      .upload(`blog/${fileName}`, thumbnail);
    if (data)
      createBlog({
        payload: {
          thumbnail: `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/blog/${fileName}`,
        },
      });
    if (error) {
      setLoading(false);
      return showToast('Thumbnail', 'Gagal Upload Thumbnail....');
    }
  };

  return (
    <div
      id="blog-admin"
      className="flex w-full flex-col gap-[2rem] bg-white p-[1rem]"
    >
      <h1 className="text-center text-[1.2rem] font-bold">TutorSNBT Blog</h1>
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
        <InputImageFile
          heading="Thumbnail Blog"
          setValue={setThumbnail}
          value={thumbnail}
          placeholder="Description"
        />

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
                <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
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
          {status === 'SCHEDULED' && (
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
              console.log('value', value);
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
                      {tagVal.title
                        ? tagsData?.find((tag) => tag.title === tagVal.title)
                            ?.title
                        : 'Select Blog Tag'}
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
      <BlogEditor
        value={value}
        onChange={(value) => {
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
            onClick={() => {
              handlePost();
            }}
          >
            Post Blog
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBlogAdmin;

const InputText = ({
  heading,
  placeholder,
  setValue,
  value,
}: {
  heading: string;
  placeholder: string;
  setValue: any;
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
  setValue: any;
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

const InputImageFile = ({
  heading,
  placeholder,
  setValue,
  value,
}: {
  heading: string;
  placeholder: string;
  setValue: any;
  value: File | undefined;
}) => {
  return (
    <div
      id="name-file"
      className="flex flex-col gap-[.5rem]"
    >
      <p>{heading}</p>
      <InputImage
        required
        onChange={(image) => {
          setValue(image);
        }}
      />
    </div>
  );
};
