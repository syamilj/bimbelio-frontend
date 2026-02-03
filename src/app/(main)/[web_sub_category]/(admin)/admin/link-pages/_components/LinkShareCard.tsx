"use client";

import { useMemo } from "react";
import QRCode from "react-qr-code";
import { Copy, ExternalLink, Share2 } from "lucide-react";

import { LinkPageDetail } from "@/types/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toaster } from "@/components/ui/toaster";

interface LinkShareCardProps {
  linkPage?: LinkPageDetail | null;
  sendingTest?: boolean;
  onSendTest?: () => Promise<void>;
}

const getOrigin = () => (typeof window !== "undefined" ? window.location.origin : "https://bimbelio.com");

export function LinkShareCard({ linkPage, sendingTest = false, onSendTest }: LinkShareCardProps) {
  const origin = useMemo(() => getOrigin(), []);
  const publicUrl = linkPage ? `${origin}/link/${linkPage.slug}` : "";

  const handleCopy = (value: string, label: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toaster({
      title: "Copied",
      description: `${label} copied to clipboard`,
      condition: "success",
    });
  };

  const shortUrls = linkPage?.shortUrls || [];
  const hasPixels = (linkPage?.enableMetaCAPI && linkPage.metaPixelId) || (linkPage?.enableTikTokEvents && linkPage.tiktokPixelCode);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Share & Tracking</CardTitle>
          <CardDescription>Copy shortcuts, generate QR, and verify pixel delivery.</CardDescription>
        </div>
        <Badge variant={linkPage?.isActive ? "default" : "secondary"} className="w-fit">
          {linkPage?.isActive ? "Live" : "Inactive"}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Public URL</p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded bg-muted px-3 py-1 text-sm">{publicUrl || "-"}</code>
              <Button size="sm" variant="secondary" onClick={() => handleCopy(publicUrl, "Public URL")} disabled={!publicUrl}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={() => publicUrl && window.open(publicUrl, "_blank") } disabled={!publicUrl}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Shortcut Links</p>
              <Badge variant="outline">{shortUrls.length} active</Badge>
            </div>
            {shortUrls.length === 0 ? (
              <p className="text-sm text-muted-foreground">Short URL not generated yet. Use backend or automation to add tracking codes.</p>
            ) : (
              <div className="space-y-2">
                {shortUrls.map((short) => {
                  const shortUrl = `${origin}/${short.code}`;
                  return (
                    <div key={short.id} className="flex flex-wrap items-center gap-2 rounded-3xl border p-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{shortUrl}</span>
                        <span className="text-xs text-muted-foreground">{short.clickCount} clicks</span>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => handleCopy(shortUrl, "Short URL")}
                        className="ml-auto">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-3xl border p-3">
              <p className="text-sm font-medium">Referral Tracking</p>
              {linkPage?.enableReferralTracking ? (
                <div className="space-y-1">
                  <p className="text-sm">Enabled · {linkPage.referralCookieDays ?? 30} day cookie</p>
                  <p className="text-xs text-muted-foreground">Use `?ref=CODE` to attribute conversions.</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Referral tracking disabled.</p>
              )}
            </div>
            <div className="space-y-2 rounded-3xl border p-3">
              <p className="text-sm font-medium">Pixel Status</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant={linkPage?.enableMetaCAPI ? "default" : "secondary"}>Meta CAPI</Badge>
                <Badge variant={linkPage?.enableTikTokEvents ? "default" : "secondary"}>TikTok Events</Badge>
                {!hasPixels && <span className="text-xs text-muted-foreground">No pixels connected</span>}
              </div>
              {onSendTest && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={onSendTest}
                  disabled={sendingTest || !hasPixels}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {sendingTest ? "Sending test event..." : "Send Test Conversion"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border bg-muted/40 p-4">
          <QRCode value={publicUrl || "https://bimbelio.com"} bgColor="transparent" fgColor="#111" size={160} />
          <p className="text-center text-sm text-muted-foreground">
            Scan to preview this Link-in-Bio page instantly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
