import { SeriesLabel } from '@/components/brand/series-label';
import {
  GraduationCap,
  Landmark,
  Lightbulb,
  Newspaper,
  School,
  type LucideIcon,
} from 'lucide-react';

// Kategori blog = tag pertama artikel, ditampilkan sebagai label seri (brand book hlm. 57).
const RULES: [RegExp, LucideIcon][] = [
  [/tips|strategi|belajar/i, Lightbulb],
  [/kedinasan|stan|stis|ipdn|skd/i, Landmark],
  [/mandiri|simak|ugm|utul|ui\b/i, School],
  [/snbt|utbk|ptn/i, GraduationCap],
];

export const categoryIcon = (tag: string): LucideIcon =>
  RULES.find(([re]) => re.test(tag))?.[1] ?? Newspaper;

const ACRONYMS = new Set([
  'snbt',
  'utbk',
  'ptn',
  'skd',
  'ui',
  'ugm',
  'itb',
  'stan',
  'stis',
  'ipdn',
  'tka',
  'irt',
]);

/** Huruf kalimat untuk label: "tips belajar" → "Tips belajar", "snbt" → "SNBT". */
export const categoryLabel = (tag: string) =>
  ACRONYMS.has(tag.toLowerCase())
    ? tag.toUpperCase()
    : tag.charAt(0).toUpperCase() + tag.slice(1);

export function BlogCategory({
  tag,
  tone,
  className,
}: {
  tag: string;
  tone?: 'ink' | 'light';
  className?: string;
}) {
  return (
    <SeriesLabel
      icon={categoryIcon(tag)}
      tone={tone}
      className={className}
    >
      {categoryLabel(tag)}
    </SeriesLabel>
  );
}
