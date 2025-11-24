"use client";

import { useSession } from "@/components/provider/provider-session-auth";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchAllShortUrls, deleteShortUrl, type ShortUrl } from "@/lib/api/short-url";
import { Copy, Edit, ExternalLink, MoreVertical, Plus, QrCode, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ListPagination from "@/components/ui/list-pagination";
import { QrCodeDialog } from "./_components/QrCodeDialog";

export default function ShortUrlsPage() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();

  const mainColor = websiteSubCategory?.main_color || "#0091FF";

  const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const take = 20;
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedShortUrl, setSelectedShortUrl] = useState<ShortUrl | null>(null);

  const loadShortUrls = async () => {
    try {
      setLoading(true);
      const response = await fetchAllShortUrls({
        website_sub_category_id: websiteSubCategory?.id,
        page,
        take,
        search: searchTerm,
      });
      setShortUrls(response.data || []);
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error("Failed to load short URLs:", error);
      toast.error("Gagal memuat short URLs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShortUrls();
  }, [page, searchTerm, websiteSubCategory?.id]);

  const handleCopyUrl = (code: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const fullUrl = `${baseUrl}/l/${code}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("URL copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this short URL?")) return;

    try {
      await deleteShortUrl(id);
      toast.success("Short URL deleted successfully");
      loadShortUrls();
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete short URL");
    }
  };

  const getDestinationDisplay = (url: ShortUrl) => {
    if (url.destinationType === "LINK_PAGE" && url.LinkPage) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" style={{ borderColor: mainColor, color: mainColor }}>
            Link Page
          </Badge>
          <span className="text-sm text-gray-600">{url.LinkPage.title}</span>
        </div>
      );
    }
    return (
      <div className="max-w-xs truncate text-sm text-gray-600">
        {url.destinationUrl}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Short URLs</h1>
          <p className="text-gray-600 mt-1">Manage your short links and track clicks</p>
        </div>
        <Link href={`/${websiteSubCategory?.id}/admin/short-urls/create`}>
          <Button style={{ backgroundColor: mainColor }} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Short URL
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Short URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shortUrls.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shortUrls.reduce((acc, url) => acc + url.totalClicks, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shortUrls.reduce((acc, url) => acc + url.totalUniqueIps, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by code, title, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : shortUrls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No short URLs found. Create your first one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shortUrls.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          {url.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyUrl(url.code)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      {url.title && (
                        <div className="text-sm text-gray-600 mt-1">{url.title}</div>
                      )}
                    </TableCell>
                    <TableCell>{getDestinationDisplay(url)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{url.totalClicks.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">
                          ({url.totalUniqueIps} unique)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {url.isActive ? (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-400 text-gray-600">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/${websiteSubCategory?.id}/admin/short-urls/${url.id}/analytics`
                              )
                            }
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/${websiteSubCategory?.id}/admin/short-urls/edit/${url.id}`
                              )
                            }
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedShortUrl(url);
                              setQrDialogOpen(true);
                            }}
                          >
                            <QrCode className="w-4 h-4 mr-2" />
                            QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyUrl(url.code)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(`/l/${url.code}`, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(url.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <ListPagination
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
          totalPage={totalPages}
          pageSize={take}
        />
      )}

      {/* QR Code Dialog */}
      {selectedShortUrl && (
        <QrCodeDialog
          open={qrDialogOpen}
          onClose={() => {
            setQrDialogOpen(false);
            setSelectedShortUrl(null);
          }}
          shortUrlId={selectedShortUrl.id}
          code={selectedShortUrl.code}
        />
      )}
    </div>
  );
}
