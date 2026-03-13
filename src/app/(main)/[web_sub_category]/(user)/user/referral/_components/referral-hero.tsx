'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface ReferralHeroProps {
  referralCode: string;
  createdAt: string;
}

export function ReferralHero({ referralCode }: ReferralHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
          Link Referral Anda
        </h1>
        <p className="text-sm text-slate-600">
          Bagikan link referral Anda dan dapatkan komisi 33% dari setiap pembelian
        </p>
      </div>

      {/* Referral Code Section */}
      <div className="mb-8">
        <label className="text-sm font-bold text-slate-700 mb-3 block">
          Kode Referral
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={referralCode}
            readOnly
            className="flex-1 font-mono text-base"
          />
          <Button
            onClick={handleCopyReferralCode}
            variant="outline"
            size="icon"
            title="Copy referral code"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        {copied && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Berhasil disalin ke clipboard
          </p>
        )}
      </div>
    </div>
  );
}
