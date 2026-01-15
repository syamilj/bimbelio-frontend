'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchAllLinkPages, deleteLinkPage } from '@/lib/api/link-pages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  BarChart3,
  Copy,
  ExternalLink,
  Rows3,
  Sparkles,
  Activity,
  Lock,
} from 'lucide-react';
import { toaster } from '@/components/ui/toaster';

interface LinkPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  isActive: boolean;
  totalViews: number;
  totalClicks: number;
  conversionCount: number;
  buttonCount: number;
  enableMetaCAPI: boolean;
  enableTikTokEvents: boolean;
  createdAt: string;
}

export default function LinkPagesPage() {
  const router = useRouter();
  const params = useParams();
  const webSubCategory = params.web_sub_category as string;

  const [linkPages, setLinkPages] = useState<LinkPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchLinkPages();
  }, [page, searchQuery]);

  const fetchLinkPages = async () => {
    try {
      setLoading(true);
      const response = await fetchAllLinkPages({
        website_sub_category_id: webSubCategory,
        page,
        take: 10,
        search: searchQuery,
      });

      setLinkPages(response.data);
      setTotalPages(response.total_pages || 1);
    } catch (error: any) {
      toaster({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch link pages',
        condition: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = useMemo(() => {
    if (statusFilter === 'all') return linkPages;
    const isActive = statusFilter === 'active';
    return linkPages.filter((page) => page.isActive === isActive);
  }, [linkPages, statusFilter]);

  const overviewData = useMemo(() => {
    const views = linkPages.reduce((sum, p) => sum + p.totalViews, 0);
    const clicks = linkPages.reduce((sum, p) => sum + p.totalClicks, 0);
    const conversions = linkPages.reduce((sum, p) => sum + p.conversionCount, 0);
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';
    return { views, clicks, conversions, ctr };
  }, [linkPages]);

  const recentPages = useMemo(() => {
    return [...linkPages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [linkPages]);

  const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link page?')) return;

    try {
      await deleteLinkPage(id);
      toaster({
        title: 'Success',
        description: 'Link page deleted successfully',
        condition: 'success',
      });
      fetchLinkPages();
    } catch (error: any) {
      toaster({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete link page',
        condition: 'warning',
      });
    }
  };

  const copyLinkUrl = (slug: string) => {
    const url = `${window.location.origin}/link/${slug}`;
    navigator.clipboard.writeText(url);
    toaster({
      title: 'Success',
      description: 'Link copied to clipboard!',
      condition: 'success',
    });
  };

  const openLink = (slug: string) => {
    window.open(`/link/${slug}`, '_blank');
  };

  return (
    <div className="space-y-8 px-4 py-8">
      <section className="rounded-3xl border border-border bg-card px-6 py-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Link-in-bio workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Kelola & optimalkan semua Link Page</h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Monitor performa, aktifkan pixel, dan atur tombol hanya dalam beberapa klik. Tampilan baru ini dirancang agar tim bisa bergerak lebih cepat.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <Button variant="outline" className="gap-2" onClick={() => router.push(`/${webSubCategory}/admin/short-urls`)}>
              <Sparkles className="h-4 w-4" />
              Otomatiskan Short URL
            </Button>
            <Button className="gap-2" onClick={() => router.push(`/${webSubCategory}/admin/link-pages/create`)}>
              <Plus className="h-4 w-4" />
              Link Page Baru
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl border-none bg-secondary/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                Total Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{linkPages.length}</p>
              <p className="text-xs text-muted-foreground">Aktif & terarsip</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-none bg-secondary/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{formatNumber(overviewData.views)}</p>
              <p className="text-xs text-muted-foreground">Sejak awal pencatatan</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-none bg-secondary/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                Total Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{formatNumber(overviewData.clicks)}</p>
              <p className="text-xs text-muted-foreground">Semua tombol</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-none bg-secondary/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{overviewData.ctr}%</p>
              <p className="text-xs text-muted-foreground">Clicks ÷ views</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="rounded-3xl border bg-card">
          <CardHeader className="space-y-2">
            <div className="flex flex-col gap-3 md:flex-row md:justify-between">
              <div>
                <CardTitle>Daftar Link Page</CardTitle>
                <CardDescription>Filter berdasarkan status dan lakukan aksi cepat</CardDescription>
              </div>
              <div className="flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium">
                <Activity className="h-4 w-4" />
                {filteredPages.length} halaman tampil
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari judul atau slug..."
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    setSearchQuery(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 rounded-full border bg-muted/30 p-1">
                {['all', 'active', 'inactive'].map((filter) => (
                  <Button
                    key={filter}
                    type="button"
                    size="sm"
                    variant={statusFilter === filter ? 'default' : 'ghost'}
                    className="rounded-full px-4"
                    onClick={() => setStatusFilter(filter as typeof statusFilter)}
                  >
                    {filter === 'all' ? 'Semua' : filter === 'active' ? 'Aktif' : 'Nonaktif'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="grid w-full max-w-sm grid-cols-2">
                <TabsTrigger value="table">Tampilan tabel</TabsTrigger>
                <TabsTrigger value="grid">Ringkasan kartu</TabsTrigger>
              </TabsList>
              <TabsContent value="table" className="mt-6">
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton key={`s-${index}`} className="h-16 w-full rounded-3xl" />
                    ))}
                  </div>
                ) : filteredPages.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-muted-foreground/30 px-6 py-12 text-center text-muted-foreground">
                    <p className="text-base font-semibold">Belum ada data sesuai filter.</p>
                    <p className="mt-1 text-sm">Coba ubah pencarian atau tambahkan link page baru.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Judul</TableHead>
                          <TableHead>Slug</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Clicks</TableHead>
                          <TableHead>Conversions</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPages.map((page) => (
                          <TableRow key={page.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{page.title}</span>
                                {page.description && (
                                  <span className="text-xs text-muted-foreground line-clamp-1">{page.description}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="rounded bg-muted px-2 py-1 text-xs">{page.slug}</code>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyLinkUrl(page.slug)}>
                                  <Copy className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={page.isActive ? 'default' : 'secondary'} className="rounded-full">
                                {page.isActive ? 'Aktif' : 'Nonaktif'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatNumber(page.totalViews)}</TableCell>
                            <TableCell>{formatNumber(page.totalClicks)}</TableCell>
                            <TableCell>{formatNumber(page.conversionCount)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Aksi singkat</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => openLink(page.slug)}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Lihat halaman
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => copyLinkUrl(page.slug)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Salin tautan
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => router.push(`/${webSubCategory}/admin/link-pages/${page.id}/analytics`)}>
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Lihat analitik
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => router.push(`/${webSubCategory}/admin/link-pages/${page.id}/buttons`)}>
                                    <Rows3 className="mr-2 h-4 w-4" />
                                    Atur tombol
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => router.push(`/${webSubCategory}/admin/link-pages/edit/${page.id}`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Ubah
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDelete(page.id)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                      Sebelumnya
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground">
                      Halaman {page} dari {totalPages}
                    </span>
                    <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                      Selanjutnya
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="grid" className="mt-6">
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={`g-${index}`} className="h-48 w-full rounded-3xl" />
                    ))}
                  </div>
                ) : filteredPages.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-muted-foreground/30 px-6 py-12 text-center text-muted-foreground">
                    <p className="text-base font-semibold">Belum ada data sesuai filter.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredPages.map((page) => (
                      <div key={page.id} className="rounded-3xl border bg-muted/20 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-lg font-semibold">{page.title}</p>
                            <p className="text-xs text-muted-foreground">/{page.slug}</p>
                          </div>
                          <Badge variant={page.isActive ? 'default' : 'secondary'} className="rounded-full">
                            {page.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                          <div>
                            <p className="font-semibold">{formatNumber(page.totalViews)}</p>
                            <p className="text-muted-foreground">Views</p>
                          </div>
                          <div>
                            <p className="font-semibold">{formatNumber(page.totalClicks)}</p>
                            <p className="text-muted-foreground">Clicks</p>
                          </div>
                          <div>
                            <p className="font-semibold">{formatNumber(page.conversionCount)}</p>
                            <p className="text-muted-foreground">Convs</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          {page.enableMetaCAPI && <Badge variant="outline">Meta Pixel</Badge>}
                          {page.enableTikTokEvents && <Badge variant="outline">TikTok Pixel</Badge>}
                          {!page.enableMetaCAPI && !page.enableTikTokEvents && (
                            <span className="text-muted-foreground">Tidak ada pixel</span>
                          )}
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => router.push(`/${webSubCategory}/admin/link-pages/${page.id}/analytics`)}>
                            Analitik
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => router.push(`/${webSubCategory}/admin/link-pages/edit/${page.id}`)}>
                            Edit
                          </Button>
                          <Button size="sm" onClick={() => openLink(page.slug)}>
                            Lihat publik
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-muted/10">
          <CardHeader>
            <CardTitle>Quick insight</CardTitle>
            <CardDescription>Update terakhir & tautan populer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-3xl border border-dashed border-muted-foreground/30 p-4">
              <p className="text-sm font-semibold">Tingkat konversi total</p>
              <p className="text-4xl font-bold tracking-tight">{overviewData.ctr}%</p>
              <p className="text-xs text-muted-foreground">Perbandingan klik terhadap total kunjungan.</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Link terbaru</p>
              <div className="mt-3 space-y-3">
                {recentPages.map((page) => (
                  <div key={page.id} className="rounded-3xl border bg-background p-3">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{page.title}</span>
                      <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wide">
                        {page.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">/{page.slug}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatNumber(page.totalViews)} views</span>
                      <span>•</span>
                      <span>{formatNumber(page.totalClicks)} clicks</span>
                    </div>
                  </div>
                ))}
                {recentPages.length === 0 && (
                  <p className="text-sm text-muted-foreground">Belum ada data terbaru.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border bg-background p-4">
              <div className="flex items-center gap-3">
                <Lock className="h-10 w-10 rounded-full bg-muted/50 p-2" />
                <div>
                  <p className="font-semibold">Proteksi & pixel</p>
                  <p className="text-sm text-muted-foreground">Aktifkan Meta / TikTok pixel untuk setiap halaman.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                <p>Meta active: {linkPages.filter((p) => p.enableMetaCAPI).length}</p>
                <p>TikTok active: {linkPages.filter((p) => p.enableTikTokEvents).length}</p>
              </div>
              <Button variant="secondary" className="mt-4 w-full" onClick={() => router.push(`/${webSubCategory}/admin/link-pages/create`)}>
                Buat halaman dengan template baru
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
