import { BimBot } from '@/components/ui/bim-brand';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// --- Types ---

export interface SubmenuItem {
  href: string;
  label: string;
  isLink?: boolean;
  description?: string;
  icon?: string;
  badge?: {
    text: string;
    variant?: 'success' | 'info' | 'warning' | 'premium';
  };
  action?: 'openContact';
}

export interface SubmenuColumn {
  title?: string;
  items: SubmenuItem[];
}

export interface NavItem {
  href: string;
  label: string;
  isLink?: boolean;
  submenu?: SubmenuItem[];
  submenuColumns?: SubmenuColumn[];
  badge?: {
    text: string;
    variant?: 'success' | 'info' | 'warning' | 'premium';
  };
  action?: 'openContact';
}

// --- Helpers ---

/** Render labels with BimBrand component styling */
export const renderLabel = (label: string): React.ReactNode => {
  if (label === 'Bimbot AI') {
    return (
      <>
        <BimBot /> AI
      </>
    );
  }
  return label;
};

/** Get Lucide icon component by name */
export const getIconComponent = (iconName?: string): LucideIcon | null => {
  if (!iconName) return null;
  return (LucideIcons as any)[iconName] || null;
};

/** Get badge styling based on variant */
export const getBadgeStyles = (variant?: string) => {
  const styles = {
    success: { bg: '#10b981', text: 'white' },
    info: { bg: '#3b82f6', text: 'white' },
    warning: { bg: '#f59e0b', text: 'white' },
    premium: {
      bg: 'linear-gradient(135deg, #ffd700, #ffed4e)',
      text: '#000',
    },
  };
  return styles[variant as keyof typeof styles] || styles.info;
};

/** Open the floating contact dialog by programmatically clicking the floating button */
export const openContactDialog = () => {
  try {
    const btn = document.querySelector(
      'button[aria-label="Buka menu konsultasi"]',
    ) as HTMLElement | null;
    if (btn) {
      btn.click();
      return true;
    }
    const altBtn = document.querySelector(
      'button[role="button"]',
    ) as HTMLElement | null;
    if (altBtn) {
      altBtn.click();
      return true;
    }
    console.warn('Floating contact button not found');
    return false;
  } catch (error) {
    console.warn('Error opening contact dialog', error);
    return false;
  }
};
