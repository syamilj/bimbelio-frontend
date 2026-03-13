"use client";

import type React from "react";

import { Separator } from "@/components/ui/separator";
import FormContent from "./_components/form-content";

export default function CreateVoucherPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Referral Percentage
        </h1>
        <p className="text-sm text-gray-500">Edit percentage referal.</p>
      </div>

      <Separator />

      <FormContent />
    </div>
  );
}
