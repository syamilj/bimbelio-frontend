'use client';

import { UploadFile } from '@/components/_shared/other/upload-file-with-drag-drop';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import {
  createLinkPage,
  fetchLinkPage,
  updateLinkPage,
  type CreateLinkPagePayload,
} from '@/lib/api/link-pages';
import { storage } from '@/supabaseClient';
import { LinkButton, LinkPageDetail } from '@/types/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Link as LinkIcon, Save, Trash2, Wand2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LinkPreviewPane } from './LinkPreviewPane';

type BackgroundType = 'GRADIENT' | 'COLOR' | 'IMAGE' | 'VIDEO';

const emptyUrl = z.string().trim().url('Invalid URL').or(z.literal(''));

const socialLinksSchema = z.object({
  instagram: emptyUrl.optional().default(''),
  tiktok: emptyUrl.optional().default(''),
  youtube: emptyUrl.optional().default(''),
  linkedin: emptyUrl.optional().default(''),
  twitter: emptyUrl.optional().default(''),
  facebook: emptyUrl.optional().default(''),
  whatsapp: emptyUrl.optional().default(''),
  website: emptyUrl.optional().default(''),
  custom: emptyUrl.optional().default(''),
});

const linkPageFormSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  slug: z
    .string()
    .trim()
    .max(60)
    .regex(/^[a-z0-9-]*$/, 'Use lowercase letters, numbers, and hyphen only')
    .optional()
    .default(''),
  description: z.string().max(500).optional().default(''),
  profileImage: emptyUrl.optional().default(''),
  backgroundType: z.enum(['GRADIENT', 'COLOR', 'IMAGE', 'VIDEO']),
  backgroundColor: z.string().optional().default('#667EEA'),
  backgroundImage: emptyUrl.optional().default(''),
  metaTitle: z.string().max(120).optional().default(''),
  metaDescription: z.string().max(200).optional().default(''),
  ogImage: emptyUrl.optional().default(''),
  socialLinks: socialLinksSchema,
  isActive: z.boolean(),
  isPublic: z.boolean(),
  password: z.string().max(100).optional().default(''),
  expireAt: z.string().optional().default(''),
  scheduleStart: z.string().optional().default(''),
  scheduleEnd: z.string().optional().default(''),
  isABTest: z.boolean(),
  abTestVariantsInput: z.string().optional().default(''),
  enableReferralTracking: z.boolean(),
  referralCookieDays: z.coerce.number().min(1).max(365),
  metaPixelId: z.string().optional().default(''),
  tiktokPixelCode: z.string().optional().default(''),
  enableMetaCAPI: z.boolean(),
  enableTikTokEvents: z.boolean(),
});

type LinkPageFormValues = z.infer<typeof linkPageFormSchema>;

const SOCIAL_LINK_FIELDS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'website', label: 'Website' },
  { key: 'custom', label: 'Custom' },
] as const;

const defaultValues: LinkPageFormValues = {
  title: '',
  slug: '',
  description: '',
  profileImage: '',
  backgroundType: 'GRADIENT',
  backgroundColor: '#667EEA',
  backgroundImage: '',
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  socialLinks: SOCIAL_LINK_FIELDS.reduce(
    (acc, field) => {
      acc[field.key] = '';
      return acc;
    },
    {} as Record<(typeof SOCIAL_LINK_FIELDS)[number]['key'], string>,
  ),
  isActive: true,
  isPublic: true,
  password: '',
  expireAt: '',
  scheduleStart: '',
  scheduleEnd: '',
  isABTest: false,
  abTestVariantsInput: '',
  enableReferralTracking: true,
  referralCookieDays: 30,
  metaPixelId: '',
  tiktokPixelCode: '',
  enableMetaCAPI: false,
  enableTikTokEvents: false,
};

interface LinkPageFormProps {
  mode: 'create' | 'edit';
  linkPageId?: string;
}

const dateToInputValue = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
};

const inputToIso = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

const sanitizeSocialLinks = (links: LinkPageFormValues['socialLinks']) => {
  const filteredEntries = Object.entries(links).filter(
    ([, value]) => value && value.trim().length > 0,
  );
  if (!filteredEntries.length) return undefined;
  return Object.fromEntries(filteredEntries);
};

const parseVariants = (input: string) =>
  input
    .split(/[,\n]/)
    .map((variant) => variant.trim())
    .filter(Boolean);

export default function LinkPageForm({ mode, linkPageId }: LinkPageFormProps) {
  const router = useRouter();
  const params = useParams();
  const webSubCategory = params.web_sub_category as string;
  const [fetching, setFetching] = useState(mode === 'edit');
  const [buttons, setButtons] = useState<LinkButton[]>([]);
  const [shortUrls, setShortUrls] = useState<any[]>([]);

  const form = useForm<LinkPageFormValues>({
    resolver: zodResolver(linkPageFormSchema) as any,
    defaultValues,
    mode: 'onBlur',
  });

  const watchBackgroundType = form.watch('backgroundType');
  const metaEnabled = form.watch('enableMetaCAPI');
  const tiktokEnabled = form.watch('enableTikTokEvents');
  const referralEnabled = form.watch('enableReferralTracking');
  const isABTest = form.watch('isABTest');

  const uploadImage = async (file: File, bucket: 'img' | 'video' = 'img') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error } = await storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    return `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/${filePath}`;
  };

  useEffect(() => {
    if (mode === 'edit' && linkPageId) {
      const loadLinkPage = async () => {
        try {
          setFetching(true);
          const data = await fetchLinkPage(linkPageId);
          setButtons(data.buttons || []);
          setShortUrls(data.shortUrls || []);
          form.reset({
            title: data.title ?? '',
            slug: data.slug ?? '',
            description: data.description ?? '',
            profileImage: data.profileImage ?? '',
            backgroundType:
              (data.backgroundType as BackgroundType) ?? 'GRADIENT',
            backgroundColor: data.backgroundColor ?? '#667EEA',
            backgroundImage: data.backgroundImage ?? '',
            metaTitle: data.metaTitle ?? '',
            metaDescription: data.metaDescription ?? '',
            ogImage: data.ogImage ?? '',
            socialLinks: {
              instagram: data.socialLinks?.instagram ?? '',
              tiktok: data.socialLinks?.tiktok ?? '',
              youtube: data.socialLinks?.youtube ?? '',
              linkedin: data.socialLinks?.linkedin ?? '',
              twitter: data.socialLinks?.twitter ?? '',
              facebook: data.socialLinks?.facebook ?? '',
              whatsapp: data.socialLinks?.whatsapp ?? '',
              website: data.socialLinks?.website ?? '',
              custom: data.socialLinks?.custom ?? '',
            },
            isActive: data.isActive ?? true,
            isPublic: data.isPublic ?? true,
            password: data.password ?? '',
            expireAt: dateToInputValue(data.expireAt),
            scheduleStart: dateToInputValue(data.scheduleStart),
            scheduleEnd: dateToInputValue(data.scheduleEnd),
            isABTest: data.isABTest ?? false,
            abTestVariantsInput: data.abTestConfig?.variants?.join('\n') ?? '',
            enableReferralTracking: data.enableReferralTracking ?? true,
            referralCookieDays: data.referralCookieDays ?? 30,
            metaPixelId: data.metaPixelId ?? '',
            tiktokPixelCode: data.tiktokPixelCode ?? '',
            enableMetaCAPI: data.enableMetaCAPI ?? false,
            enableTikTokEvents: data.enableTikTokEvents ?? false,
          });
        } catch (error: any) {
          toaster({
            title: 'Error',
            description:
              error.response?.data?.message || 'Failed to fetch link page',
            condition: 'warning',
          });
          router.back();
        } finally {
          setFetching(false);
        }
      };

      loadLinkPage();
    }
  }, [mode, linkPageId, form, router]);

  const onSubmit = async (values: LinkPageFormValues) => {
    try {
      const payload: Record<string, any> = {
        title: values.title,
        description: values.description || undefined,
        profileImage: values.profileImage || undefined,
        backgroundType: values.backgroundType,
        backgroundColor: values.backgroundColor || undefined,
        backgroundImage: values.backgroundImage || undefined,
        metaTitle: values.metaTitle || undefined,
        metaDescription: values.metaDescription || undefined,
        ogImage: values.ogImage || undefined,
        isActive: values.isActive,
        isPublic: values.isPublic,
        password: values.password || undefined,
        expireAt: inputToIso(values.expireAt),
        scheduleStart: inputToIso(values.scheduleStart),
        scheduleEnd: inputToIso(values.scheduleEnd),
        isABTest: values.isABTest,
        abTestConfig: values.isABTest
          ? { variants: parseVariants(values.abTestVariantsInput) }
          : undefined,
        enableReferralTracking: values.enableReferralTracking,
        referralCookieDays: values.referralCookieDays,
        metaPixelId: values.metaPixelId || undefined,
        tiktokPixelCode: values.tiktokPixelCode || undefined,
        enableMetaCAPI: values.enableMetaCAPI,
        enableTikTokEvents: values.enableTikTokEvents,
        socialLinks: sanitizeSocialLinks(values.socialLinks),
      };

      if (mode === 'create') {
        payload.slug = values.slug || undefined;
        payload.website_sub_category_id = webSubCategory;
        await createLinkPage(payload as CreateLinkPagePayload);
        toaster({
          title: 'Success',
          description: 'Link page created successfully!',
          condition: 'success',
        });
        router.push(`/${webSubCategory}/admin/link-pages`);
      } else {
        await updateLinkPage(linkPageId!, payload);
        toaster({
          title: 'Success',
          description: 'Link page updated successfully!',
          condition: 'success',
        });
        router.push(`/${webSubCategory}/admin/link-pages`);
      }
    } catch (error: any) {
      toaster({
        title: 'Error',
        description:
          error.response?.data?.message || `Failed to ${mode} link page`,
        condition: 'warning',
      });
    }
  };

  const metaPreview = useMemo(() => {
    const title = form.watch('metaTitle') || form.watch('title') || 'Untitled';
    const description =
      form.watch('metaDescription') ||
      form.watch('description') ||
      'Add a compelling description';
    const url = `${typeof window !== 'undefined' ? window?.location.origin : 'https://example.com'}/link/${form.watch('slug') || 'your-slug'}`;
    return { title, description, url };
  }, [form]);

  const previewPage = useMemo(() => {
    const values = form.getValues();
    return {
      id: linkPageId || 'preview',
      ...values,
      website_sub_category_id: webSubCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalViews: 0,
      totalClicks: 0,
      conversionCount: 0,
      buttons: buttons,
      shortUrls: shortUrls,
    } as unknown as LinkPageDetail;
  }, [form.watch(), buttons, shortUrls]);

  const generateOgImage = () => {
    const title = form.getValues('title');
    const description = form.getValues('description');
    const image = form.getValues('profileImage');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (description) params.set('description', description);
    if (image) params.set('image', image);

    const url = `${origin}/api/og?${params.toString()}`;
    form.setValue('ogImage', url, { shouldDirty: true });
    toaster({
      title: 'OG Image Generated',
      description: 'The OG image URL has been updated.',
      condition: 'success',
    });
  };

  const disabled = form.formState.isSubmitting;

  if (mode === 'edit' && fetching) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-[1600px]">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Create' : 'Edit'} Link Page
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'create'
              ? 'Configure branding, SEO, referral tracking, and pixels in one place'
              : 'Update your link page settings, pixels, and targeting'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit as any)}>
              <Tabs
                defaultValue="basic"
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Social</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced & Pixels</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="basic"
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>
                        Give your page a recognizable identity.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control as any}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="My Awesome Links"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This appears at the top of your link page.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {mode === 'create' ? (
                        <FormField
                          control={form.control as any}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Slug (optional)</FormLabel>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  /link/
                                </span>
                                <FormControl>
                                  <Input
                                    placeholder="my-custom-slug"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormDescription>
                                Leave empty to auto-generate a unique slug.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="space-y-2">
                          <FormLabel>Slug</FormLabel>
                          <div className="flex items-center gap-2">
                            <Input
                              value={form.getValues('slug') || ''}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Slug cannot be changed after creation.
                          </p>

                          {shortUrls.length > 0 && (
                            <div className="mt-4 rounded-md border p-4">
                              <h4 className="mb-2 text-sm font-medium">
                                Connected Short Links
                              </h4>
                              <div className="space-y-2">
                                {shortUrls.map((url) => (
                                  <div
                                    key={url.id}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-mono">
                                        {url.code}
                                      </span>
                                    </div>
                                    <Badge variant="secondary">
                                      {url.clickCount} clicks
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <FormField
                        control={form.control as any}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={3}
                                placeholder="Share what this page is about"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control as any}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2 rounded-lg border p-4">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <FormLabel>Active</FormLabel>
                                  <FormDescription>
                                    Make this page publicly accessible.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control as any}
                          name="isPublic"
                          render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2 rounded-lg border p-4">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <FormLabel>Indexable</FormLabel>
                                  <FormDescription>
                                    Allow search engines to index this page.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Scheduling & Expiry</CardTitle>
                      <CardDescription>
                        Control when your page is visible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control as any}
                        name="scheduleStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name="scheduleEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name="expireAt"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Expiration Date</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Automatically archive after this time.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="branding"
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Branding</CardTitle>
                      <CardDescription>
                        Align the link page with your brand.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control as any}
                        name="profileImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Image</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                {field.value && (
                                  <div className="relative h-32 w-32 overflow-hidden rounded-full border">
                                    <img
                                      src={field.value}
                                      alt="Profile"
                                      className="h-full w-full object-cover"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute right-2 top-2 h-6 w-6"
                                      onClick={() => field.onChange('')}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                                <UploadFile
                                  file={null}
                                  setFile={async (file: File) => {
                                    if (file) {
                                      try {
                                        const url = await uploadImage(file);
                                        field.onChange(url);
                                        toaster({
                                          title: 'Image uploaded',
                                          condition: 'success',
                                        });
                                      } catch (e: any) {
                                        toaster({
                                          title: 'Upload failed',
                                          description: e.message,
                                          condition: 'warning',
                                        });
                                      }
                                    }
                                  }}
                                  heading="Upload Profile Image"
                                  buttonText="Choose Image"
                                  image={true}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as any}
                        name="backgroundType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="GRADIENT">
                                  Gradient
                                </SelectItem>
                                <SelectItem value="COLOR">
                                  Solid Color
                                </SelectItem>
                                <SelectItem value="IMAGE">Image</SelectItem>
                                <SelectItem value="VIDEO">Video</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as any}
                        name="backgroundColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Background Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="color"
                                  className="w-20"
                                  value={field.value || '#667EEA'}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <Input
                                type="text"
                                value={field.value || ''}
                                onChange={field.onChange}
                                placeholder="#667EEA"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(watchBackgroundType === 'IMAGE' ||
                        watchBackgroundType === 'VIDEO') && (
                        <FormField
                          control={form.control as any}
                          name="backgroundImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Background{' '}
                                {watchBackgroundType === 'IMAGE'
                                  ? 'Image'
                                  : 'Video'}
                              </FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  {field.value && (
                                    <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                                      {watchBackgroundType === 'VIDEO' ? (
                                        <video
                                          src={field.value}
                                          controls
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <img
                                          src={field.value}
                                          alt="Background"
                                          className="h-full w-full object-cover"
                                        />
                                      )}
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute right-2 top-2 h-6 w-6"
                                        onClick={() => field.onChange('')}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                  <UploadFile
                                    file={null}
                                    setFile={async (file: File) => {
                                      if (file) {
                                        try {
                                          const bucket =
                                            watchBackgroundType === 'VIDEO'
                                              ? 'video'
                                              : 'img';
                                          const url = await uploadImage(
                                            file,
                                            bucket,
                                          );
                                          field.onChange(url);
                                          toaster({
                                            title: 'File uploaded',
                                            condition: 'success',
                                          });
                                        } catch (e: any) {
                                          toaster({
                                            title: 'Upload failed',
                                            description: e.message,
                                            condition: 'warning',
                                          });
                                        }
                                      }
                                    }}
                                    heading={`Upload Background ${watchBackgroundType === 'VIDEO' ? 'Video' : 'Image'}`}
                                    buttonText="Choose File"
                                    image={watchBackgroundType !== 'VIDEO'}
                                    inputId={
                                      watchBackgroundType === 'VIDEO'
                                        ? 'videoFile'
                                        : 'bgImageFile'
                                    }
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="seo"
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO</CardTitle>
                      <CardDescription>
                        Help search engines understand your page.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control as any}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="My Links - Brand"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={3}
                                placeholder="Share a compelling summary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name="ogImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>OG Image URL</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="url"
                                  placeholder="https://..."
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={generateOgImage}
                                title="Generate from content"
                              >
                                <Wand2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <FormDescription>
                              Recommended size 1200x630px.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase text-muted-foreground">
                          Google Preview
                        </p>
                        <p className="text-lg text-blue-700 line-clamp-1">
                          {metaPreview.title}
                        </p>
                        <p className="text-sm text-green-700">
                          {metaPreview.url}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {metaPreview.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Social Links</CardTitle>
                      <CardDescription>
                        Add verified links for quick access.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      {SOCIAL_LINK_FIELDS.map((fieldMeta) => (
                        <FormField
                          key={fieldMeta.key}
                          control={form.control as any}
                          name={`socialLinks.${fieldMeta.key}` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{fieldMeta.label}</FormLabel>
                              <FormControl>
                                <Input
                                  type="url"
                                  placeholder={`https://${fieldMeta.key}.com/username`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="advanced"
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Referral Tracking</CardTitle>
                      <CardDescription>
                        Reward partners with cookie attribution.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control as any}
                        name="enableReferralTracking"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-2 rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <FormLabel>Enable Referral Tracking</FormLabel>
                                <FormDescription>
                                  Track conversions from referral codes.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      {referralEnabled && (
                        <FormField
                          control={form.control as any}
                          name="referralCookieDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Referral Cookie Days</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={365}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                How long to attribute referrals (1-365 days).
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>A/B Testing</CardTitle>
                      <CardDescription>
                        Run experiments to optimize conversions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control as any}
                        name="isABTest"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-2 rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <FormLabel>Enable A/B Testing</FormLabel>
                                <FormDescription>
                                  Serve different variants evenly.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      {isABTest && (
                        <FormField
                          control={form.control as any}
                          name="abTestVariantsInput"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Variant Names</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  placeholder="Variant A\nVariant B"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Separate variants with commas or new lines.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🎯</span> Pixel Tracking
                        (Meta & TikTok)
                      </CardTitle>
                      <CardDescription>
                        Enable server-side conversion tracking.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control as any}
                        name="enableMetaCAPI"
                        render={({ field }) => (
                          <FormItem className="space-y-3 rounded-lg border bg-white p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <FormLabel>Meta Conversion API</FormLabel>
                                <FormDescription>
                                  Send PageView, Lead, Purchase events.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                            {metaEnabled && (
                              <FormField
                                control={form.control as any}
                                name="metaPixelId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Meta Pixel ID</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="1234567890123456"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as any}
                        name="enableTikTokEvents"
                        render={({ field }) => (
                          <FormItem className="space-y-3 rounded-lg border bg-white p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <FormLabel>TikTok Events API</FormLabel>
                                <FormDescription>
                                  Send ViewContent, Click, CompletePayment
                                  events.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                            {tiktokEnabled && (
                              <FormField
                                control={form.control as any}
                                name="tiktokPixelCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>TikTok Pixel Code</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="ABCDEF123456"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </FormItem>
                        )}
                      />

                      {(metaEnabled || tiktokEnabled) && (
                        <div className="rounded-lg border border-blue-200 bg-blue-100 p-4 text-sm text-blue-900">
                          <p className="font-semibold">
                            ✨ Pixel tracking enabled
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-4">
                            <li>
                              Page views automatically send PageView/ViewContent
                              events.
                            </li>
                            <li>Button clicks emit Lead/Click events.</li>
                            <li>
                              Conversions map to Purchase, Subscribe, and more.
                            </li>
                            <li>Server-side signals bypass ad blockers.</li>
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Password Protection</CardTitle>
                      <CardDescription>
                        Restrict access with a shared secret.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control as any}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password (optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Leave empty for no password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={disabled}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={disabled}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {disabled
                    ? mode === 'create'
                      ? 'Creating...'
                      : 'Updating...'
                    : mode === 'create'
                      ? 'Create Link Page'
                      : 'Update Link Page'}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-8">
            <LinkPreviewPane
              page={previewPage}
              buttons={buttons}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
