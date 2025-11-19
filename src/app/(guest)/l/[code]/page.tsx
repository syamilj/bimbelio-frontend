"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShortUrlRedirect() {
  const params = useParams();
  const code = params.code as string;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect immediately to backend endpoint which handles analytics and redirect
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const redirectUrl = `${backendUrl}/l/${code}`;

    // Immediate redirect
    window.location.href = redirectUrl;
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Link Not Found</h1>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.href = "/"}>
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <ExternalLink className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Redirecting...</h1>
            <p className="text-gray-600">
              Please wait while we redirect you to your destination
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting now...</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Short URL: <span className="font-mono font-medium">/{code}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
