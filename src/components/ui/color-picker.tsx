"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(value || "#000000");

  useEffect(() => {
    setHexValue(value || "#000000");
  }, [value]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexValue(newColor);
    onChange(newColor);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHexValue(newHex);
    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      onChange(newHex);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {label && <span className="text-sm">{label}</span>}
      <Input
        type="color"
        value={hexValue}
        onChange={handleColorChange}
        className="w-12 h-10 p-1"
      />
      <Input
        type="text"
        value={hexValue}
        onChange={handleHexChange}
        placeholder="#000000"
        className="flex-1"
      />
    </div>
  );
}
