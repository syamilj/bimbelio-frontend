'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { fetchAllLinkPages } from '@/lib/api/link-pages';
import {
  updateShortUrl,
  type ShortUrl,
  type UpdateShortUrlPayload,
} from '@/lib/api/short-url';
import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';
import { ArrowLeft, Link2, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function EditShortUrlPage() {
  const params = useParams();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const shortUrlId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [linkPages, setLinkPages] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<ShortUrl | null>(null);
  const [formData, setFormData] = useState<Omit<UpdateShortUrlPayload, 'id'>>(
    {},
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);

        // Load short URL data
        const { data } = await axiosInstanceWithToken.get(
          `/l/admin/getAllShortUrls`,
          {
            params: {
              website_sub_category_id: websiteSubCategory?.id,
            },
          },
        );

        const shortUrl = data.data.find(
          (url: ShortUrl) => url.id === shortUrlId,
        );
        if (!shortUrl) {
          toast.error('Short URL not found');
          router.push(`/${websiteSubCategory?.id}/admin/short-urls`);
          return;
        }

        setOriginalData(shortUrl);

        // Set form data from existing short URL
        setFormData({
          code: shortUrl.code,
          title: shortUrl.title || undefined,
          description: shortUrl.description || undefined,
          destinationType: shortUrl.destinationType,
          destinationUrl: shortUrl.destinationUrl || undefined,
          linkPageId: shortUrl.linkPageId || undefined,
          utmSource: shortUrl.utmSource || undefined,
          utmMedium: shortUrl.utmMedium || undefined,
          utmCampaign: shortUrl.utmCampaign || undefined,
          utmContent: shortUrl.utmContent || undefined,
          utmTerm: shortUrl.utmTerm || undefined,
          expireAt: shortUrl.expireAt
            ? new Date(shortUrl.expireAt).toISOString().slice(0, 16)
            : undefined,
          maxClicks: shortUrl.maxClicks || undefined,
          isActive: shortUrl.isActive,
        });

        // Load link pages for dropdown
        const response = await fetchAllLinkPages({
          website_sub_category_id: websiteSubCategory?.id,
        });
        setLinkPages(response.data || []);
      } catch (error: any) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load short URL data');
        router.push(`/${websiteSubCategory?.id}/admin/short-urls`);
      } finally {
        setLoadingData(false);
      }
    };

    if (shortUrlId && websiteSubCategory?.id) {
      loadData();
    }
  }, [shortUrlId, websiteSubCategory?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.destinationType === 'DIRECT' && !formData.destinationUrl) {
      toast.error('Destination URL is required for DIRECT type');
      return;
    }

    if (formData.destinationType === 'LINK_PAGE' && !formData.linkPageId) {
      toast.error('Link Page is required for LINK_PAGE type');
      return;
    }

    try {
      setLoading(true);
      await updateShortUrl({
        id: shortUrlId,
        ...formData,
      });

      toast.success('Short URL updated successfully!');
      router.push(`/${websiteSubCategory?.id}/admin/short-urls`);
    } catch (error: any) {
      console.error('Failed to update short URL:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to update short URL',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container mx-auto max-w-3xl p-6">
        <div className="text-center py-20 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: `${mainColor}20` }}
          >
            <Link2
              className="w-6 h-6"
              style={{ color: mainColor }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Edit Short URL</h1>
            <p className="text-gray-600 mt-1">
              Update your short link settings
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details for your short URL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Custom Code</Label>
              <Input
                id="code"
                placeholder="my-link"
                value={formData.code || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-_]/g, ''),
                  })
                }
                required
              />
              <p className="text-sm text-gray-500">
                Only lowercase letters, numbers, hyphens, and underscores
                allowed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="E.g., Black Friday Campaign"
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Internal notes about this link..."
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-sm text-gray-500">
                  Inactive links will not redirect
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive ?? true}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Destination */}
        <Card>
          <CardHeader>
            <CardTitle>Destination</CardTitle>
            <CardDescription>
              Where should this short URL redirect to?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destinationType">Destination Type</Label>
              <Select
                value={formData.destinationType}
                onValueChange={(value: any) =>
                  setFormData({
                    ...formData,
                    destinationType: value,
                    destinationUrl:
                      value === 'DIRECT' ? formData.destinationUrl : undefined,
                    linkPageId:
                      value === 'LINK_PAGE' ? formData.linkPageId : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIRECT">Direct URL</SelectItem>
                  <SelectItem value="LINK_PAGE">
                    Link Page (Link-in-Bio)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.destinationType === 'DIRECT' && (
              <div className="space-y-2">
                <Label htmlFor="destinationUrl">Destination URL *</Label>
                <Input
                  id="destinationUrl"
                  type="url"
                  placeholder="https://example.com/page"
                  value={formData.destinationUrl || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, destinationUrl: e.target.value })
                  }
                  required
                />
              </div>
            )}

            {formData.destinationType === 'LINK_PAGE' && (
              <div className="space-y-2">
                <Label htmlFor="linkPageId">Select Link Page *</Label>
                <Select
                  value={formData.linkPageId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, linkPageId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a link page..." />
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
                    No link pages found. Create one first in Link Pages section.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* UTM Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>UTM Parameters (Optional)</CardTitle>
            <CardDescription>
              Track campaign performance with UTM tags
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utmSource">UTM Source</Label>
                <Input
                  id="utmSource"
                  placeholder="facebook"
                  value={formData.utmSource || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, utmSource: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utmMedium">UTM Medium</Label>
                <Input
                  id="utmMedium"
                  placeholder="social"
                  value={formData.utmMedium || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, utmMedium: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="utmCampaign">UTM Campaign</Label>
              <Input
                id="utmCampaign"
                placeholder="spring_sale_2025"
                value={formData.utmCampaign || ''}
                onChange={(e) =>
                  setFormData({ ...formData, utmCampaign: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utmContent">UTM Content</Label>
                <Input
                  id="utmContent"
                  placeholder="banner_ad"
                  value={formData.utmContent || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, utmContent: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utmTerm">UTM Term</Label>
                <Input
                  id="utmTerm"
                  placeholder="running+shoes"
                  value={formData.utmTerm || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, utmTerm: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Options (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expireAt">Expire At</Label>
                <Input
                  id="expireAt"
                  type="datetime-local"
                  value={formData.expireAt || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, expireAt: e.target.value })
                  }
                />
                <p className="text-sm text-gray-500">
                  Link will auto-deactivate after this date
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxClicks">Max Clicks</Label>
                <Input
                  id="maxClicks"
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={formData.maxClicks || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxClicks: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
                <p className="text-sm text-gray-500">
                  Auto-deactivate after X clicks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Display */}
        {originalData && (
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Current performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">
                    {originalData.totalClicks}
                  </div>
                  <div className="text-sm text-gray-500">Total Clicks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {originalData.totalUniqueIps}
                  </div>
                  <div className="text-sm text-gray-500">Unique Visitors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {new Date(originalData.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">Created</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: mainColor }}
            className="gap-2"
          >
            {loading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
