'use client';

import {
  AdminFormActions,
  AdminFormSection,
  AdminPageHeader,
} from '@/components/admin/admin-page';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingComponentWithText } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { fetchAllLinkPages } from '@/lib/api/link-pages';
import {
  createShortUrl,
  fetchAllShortUrls,
  updateShortUrl,
  type ShortUrl,
} from '@/lib/api/short-url';
import { getDateForInputDateTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Satu form untuk buat & edit short URL (dulu dua halaman salinan ~470 baris).

type DestinationType = ShortUrl['destinationType'];

type FormState = {
  code: string;
  title: string;
  description: string;
  destinationType: DestinationType;
  destinationUrl: string;
  linkPageId: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  /** Nilai input datetime-local (waktu lokal). */
  expireAt: string;
  maxClicks: string;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  code: '',
  title: '',
  description: '',
  destinationType: 'DIRECT',
  destinationUrl: '',
  linkPageId: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmContent: '',
  utmTerm: '',
  expireAt: '',
  maxClicks: '',
  isActive: true,
};

const toFormState = (url: ShortUrl): FormState => ({
  code: url.code,
  title: url.title ?? '',
  description: url.description ?? '',
  destinationType: url.destinationType,
  destinationUrl: url.destinationUrl ?? '',
  linkPageId: url.linkPageId ?? '',
  utmSource: url.utmSource ?? '',
  utmMedium: url.utmMedium ?? '',
  utmCampaign: url.utmCampaign ?? '',
  utmContent: url.utmContent ?? '',
  utmTerm: url.utmTerm ?? '',
  // Dulu toISOString() (UTC) dimasukkan ke input waktu lokal -> bergeser 7 jam tiap simpan.
  expireAt: url.expireAt ? getDateForInputDateTime(url.expireAt) : '',
  maxClicks: url.maxClicks ? String(url.maxClicks) : '',
  isActive: url.isActive,
});

const UTM_FIELDS = [
  { key: 'utmSource', label: 'UTM Source', placeholder: 'instagram' },
  { key: 'utmMedium', label: 'UTM Medium', placeholder: 'social' },
  { key: 'utmCampaign', label: 'UTM Campaign', placeholder: 'promo_snbt_2026' },
  { key: 'utmContent', label: 'UTM Content', placeholder: 'banner_story' },
  { key: 'utmTerm', label: 'UTM Term', placeholder: 'tryout+gratis' },
] as const;

const errorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || fallback;

export const ShortUrlForm = ({ shortUrlId }: { shortUrlId?: string }) => {
  const isEdit = !!shortUrlId;
  const router = useRouter();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const websiteId = websiteSubCategory?.id;
  const listPath = `/${websiteId}/admin/short-urls`;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [original, setOriginal] = useState<ShortUrl | null>(null);
  const [linkPages, setLinkPages] = useState<
    { id: string; title: string; slug: string }[]
  >([]);
  const [isLoadingData, setIsLoadingData] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Link page dimuat bersama data edit: Select Radix terkontrol mereset nilainya
  // menjadi "" bila opsi belum ada saat nilai diisi.
  useEffect(() => {
    if (!websiteId) return;
    const loadLinkPages = fetchAllLinkPages({
      website_sub_category_id: websiteId,
    })
      .then((res) => setLinkPages(res.data || []))
      .catch(() => setLinkPages([]));
    if (!isEdit) return;

    setIsLoadingData(true);
    Promise.all([
      fetchAllShortUrls({
        website_sub_category_id: websiteId,
        id: shortUrlId,
        take: 1,
      }),
      loadLinkPages,
    ])
      .then(([res]) => {
        const url: ShortUrl | undefined = res.data?.[0];
        if (!url) {
          toast.error('Short URL tidak ditemukan');
          router.push(listPath);
          return;
        }
        setOriginal(url);
        setForm(toFormState(url));
      })
      .catch((error) => {
        toast.error(errorMessage(error, 'Gagal memuat short URL'));
        router.push(listPath);
      })
      .finally(() => setIsLoadingData(false));
  }, [isEdit, shortUrlId, websiteId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.destinationType === 'DIRECT' && !form.destinationUrl) {
      toast.error('URL tujuan wajib diisi untuk tipe Direct');
      return;
    }
    if (form.destinationType === 'LINK_PAGE' && !form.linkPageId) {
      toast.error('Pilih link page tujuan');
      return;
    }

    const isDirect = form.destinationType === 'DIRECT';
    const text = (value: string) => value.trim() || undefined;
    const common = {
      destinationType: form.destinationType,
      destinationUrl: isDirect ? form.destinationUrl : undefined,
      linkPageId: isDirect ? undefined : form.linkPageId,
      title: text(form.title),
      description: text(form.description),
      utmSource: text(form.utmSource),
      utmMedium: text(form.utmMedium),
      utmCampaign: text(form.utmCampaign),
      utmContent: text(form.utmContent),
      utmTerm: text(form.utmTerm),
    };
    // Kirim sebagai ISO (UTC) supaya server tidak menafsirkan ulang zona waktu.
    const expireAt = form.expireAt
      ? new Date(form.expireAt).toISOString()
      : null;
    const maxClicks = form.maxClicks ? Number(form.maxClicks) : null;

    setIsSaving(true);
    try {
      if (isEdit) {
        // Field opsional yang dikosongkan dikirim null supaya benar-benar terhapus.
        const cleared = Object.fromEntries(
          Object.entries(common).map(([key, value]) => [key, value ?? null]),
        ) as {
          [K in keyof typeof common]: Exclude<
            (typeof common)[K],
            undefined
          > | null;
        };
        await updateShortUrl({
          id: shortUrlId,
          ...cleared,
          destinationType: form.destinationType,
          code: form.code,
          isActive: form.isActive,
          expireAt,
          maxClicks,
        });
        toast.success('Short URL berhasil diperbarui');
      } else {
        await createShortUrl({
          ...common,
          code: form.code || undefined,
          expireAt: expireAt ?? undefined,
          maxClicks: maxClicks ?? undefined,
          website_sub_category_id: websiteId,
        });
        toast.success('Short URL berhasil dibuat');
      }
      router.push(listPath);
    } catch (error) {
      toast.error(errorMessage(error, 'Gagal menyimpan short URL'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingData)
    return <LoadingComponentWithText heading="Mengambil data short URL..." />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={isEdit ? 'Edit Short URL' : 'Buat Short URL'}
        description={
          isEdit
            ? 'Perbarui pengaturan short link'
            : 'Buat short link baru untuk melacak klik dan trafik'
        }
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <AdminFormSection title="Informasi Dasar">
          <div className="space-y-2">
            <Label htmlFor="code">
              Kode{' '}
              {!isEdit && <span className="text-gray-500">(opsional)</span>}
            </Label>
            <Input
              id="code"
              placeholder={
                isEdit
                  ? 'promo-snbt'
                  : 'promo-snbt (kosongkan untuk dibuat otomatis)'
              }
              value={form.code}
              onChange={(e) =>
                set(
                  'code',
                  e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
                )
              }
              minLength={3}
              required={isEdit}
            />
            <p className="text-sm text-gray-500">
              Hanya huruf kecil, angka, tanda hubung, dan garis bawah
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Judul <span className="text-gray-500">(opsional)</span>
            </Label>
            <Input
              id="title"
              placeholder="contoh: Kampanye Try Out Akbar"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Deskripsi <span className="text-gray-500">(opsional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Catatan internal tentang link ini..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
            />
          </div>

          {isEdit && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Status Aktif</Label>
                <p className="text-sm text-gray-500">
                  Link nonaktif tidak akan mengalihkan pengunjung
                </p>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => set('isActive', checked)}
              />
            </div>
          )}
        </AdminFormSection>

        <AdminFormSection
          title="Tujuan"
          description="Ke mana short URL ini mengarahkan pengunjung?"
        >
          <div className="space-y-2">
            <Label htmlFor="destinationType">Tipe Tujuan</Label>
            <Select
              value={form.destinationType}
              onValueChange={(value) =>
                set('destinationType', value as DestinationType)
              }
            >
              <SelectTrigger id="destinationType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIRECT">URL langsung</SelectItem>
                <SelectItem value="LINK_PAGE">
                  Link Page (link-in-bio)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.destinationType === 'DIRECT' ? (
            <div className="space-y-2">
              <Label htmlFor="destinationUrl">
                URL Tujuan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="destinationUrl"
                type="url"
                placeholder="https://bimbelio.com/snbt"
                value={form.destinationUrl}
                onChange={(e) => set('destinationUrl', e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="linkPageId">
                Link Page <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.linkPageId}
                onValueChange={(value) => set('linkPageId', value)}
              >
                <SelectTrigger id="linkPageId">
                  <SelectValue placeholder="Pilih link page..." />
                </SelectTrigger>
                <SelectContent>
                  {linkPages.map((page) => (
                    <SelectItem
                      key={page.id}
                      value={page.id}
                    >
                      {page.title} ({page.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {linkPages.length === 0 && (
                <p className="text-sm text-amber-600">
                  Belum ada link page. Buat dulu di menu Link Pages.
                </p>
              )}
            </div>
          )}
        </AdminFormSection>

        <AdminFormSection
          title="Parameter UTM"
          description="Opsional, untuk melacak performa kampanye"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {UTM_FIELDS.map(({ key, label, placeholder }) => (
              <div
                key={key}
                className="space-y-2"
              >
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </AdminFormSection>

        <AdminFormSection title="Opsi Lanjutan">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expireAt">Kedaluwarsa</Label>
              <Input
                id="expireAt"
                type="datetime-local"
                value={form.expireAt}
                onChange={(e) => set('expireAt', e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Link otomatis nonaktif setelah tanggal ini
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxClicks">Batas Klik</Label>
              <Input
                id="maxClicks"
                type="number"
                min={1}
                placeholder="Kosongkan untuk tanpa batas"
                value={form.maxClicks}
                onChange={(e) => set('maxClicks', e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Link otomatis nonaktif setelah jumlah klik ini
              </p>
            </div>
          </div>
        </AdminFormSection>

        {original && (
          <AdminFormSection
            title="Statistik"
            description="Performa saat ini"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{original.totalClicks}</div>
                <div className="text-sm text-gray-500">Total Klik</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {original.totalUniqueIps}
                </div>
                <div className="text-sm text-gray-500">Pengunjung Unik</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {new Date(original.createdAt).toLocaleDateString('id-ID')}
                </div>
                <div className="text-sm text-gray-500">Dibuat</div>
              </div>
            </div>
          </AdminFormSection>
        )}

        <AdminFormActions isSubmitting={isSaving} />
      </form>
    </div>
  );
};
