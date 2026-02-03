"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateQrCode } from "@/lib/api/short-url";
import { Download, Link2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface QrCodeDialogProps {
  open: boolean;
  onClose: () => void;
  shortUrlId: string;
  code: string;
}

export function QrCodeDialog({ open, onClose, shortUrlId, code }: QrCodeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<{
    qrCodeDataUrl: string;
    qrCodeUrl: string;
    code: string;
  } | null>(null);
  const [size, setSize] = useState(300);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await generateQrCode(shortUrlId, size);
      setQrData({ ...data, code });
    } catch (error: any) {
      console.error("Failed to generate QR code:", error);
      toast.error(error?.response?.data?.message || "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrData) return;

    const link = document.createElement("a");
    link.href = qrData.qrCodeDataUrl;
    link.download = `qr-code-${code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code downloaded!");
  };

  const handleCopyUrl = () => {
    if (!qrData) return;
    navigator.clipboard.writeText(qrData.qrCodeUrl);
    toast.success("URL copied to clipboard!");
  };

  // Generate on open
  useState(() => {
    if (open && !qrData) {
      handleGenerate();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Generator</DialogTitle>
          <DialogDescription>
            Generate and download QR code for your short URL
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Size Input */}
          <div className="space-y-2">
            <Label htmlFor="size">Size (pixels)</Label>
            <Input
              id="size"
              type="number"
              min={100}
              max={1000}
              step={50}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          {/* Generate Button */}
          {!qrData && (
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate QR Code"
              )}
            </Button>
          )}

          {/* QR Code Preview */}
          {qrData && (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-gray-50 rounded-3xl border">
                <Image
                  src={qrData.qrCodeDataUrl}
                  alt="QR Code"
                  width={size}
                  height={size}
                  className="rounded"
                />
              </div>

              {/* URL Display */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-3xl border">
                <Link2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <code className="text-sm flex-1 truncate">{qrData.qrCodeUrl}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyUrl}
                >
                  Copy
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerate}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Regenerate
                </Button>
                <Button
                  onClick={handleDownload}
                  className="flex-1 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
