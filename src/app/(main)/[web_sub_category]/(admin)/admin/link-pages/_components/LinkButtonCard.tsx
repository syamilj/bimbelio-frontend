'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toaster } from '@/components/ui/toaster';
import { LinkButton } from '@/types/link';
import {
  Copy,
  Edit,
  Gauge,
  MoveDown,
  MoveUp,
  RefreshCw,
  Trash2,
} from 'lucide-react';

interface LinkButtonCardProps {
  button: LinkButton;
  index: number;
  total: number;
  slug?: string;
  onEdit: (button: LinkButton) => void;
  onDelete: (button: LinkButton) => void;
  onDuplicate: (button: LinkButton) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleActive: (button: LinkButton, nextValue: boolean) => void;
  duplicating?: boolean;
}

export function LinkButtonCard({
  button,
  index,
  total,
  slug,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleActive,
  duplicating = false,
}: LinkButtonCardProps) {
  const allowedCount = button.allowedCountries?.length || 0;
  const blockedCount = button.blockedCountries?.length || 0;
  const publicUrl = slug ? `/link/${slug}` : undefined;

  const copyUrl = () => {
    navigator.clipboard.writeText(button.url);
    toaster({
      title: 'Copied',
      description: 'Button URL copied to clipboard',
      condition: 'success',
    });
  };

  const openPreview = () => {
    if (!publicUrl) return;
    window.open(publicUrl, '_blank');
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{button.title}</h3>
            <Badge variant="secondary">{button.type}</Badge>
            {button.abVariant && (
              <Badge variant="outline">Variant {button.abVariant}</Badge>
            )}
            {button.sectionLabel && (
              <Badge
                variant="outline"
                className="bg-muted/40"
              >
                Section: {button.sectionLabel}
              </Badge>
            )}
          </div>
          {button.subtitle && (
            <p className="text-sm text-muted-foreground">{button.subtitle}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">URL:</span>
            <span
              className="truncate max-w-[260px]"
              title={button.url}
            >
              {button.url}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyUrl}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>
              Clicks: <strong>{button.clickCount ?? 0}</strong>
            </span>
            <span>
              Order: <strong>{index + 1}</strong>
            </span>
            <span>
              Device: {button.showOnMobile ? 'Mobile' : ''}
              {button.showOnMobile && button.showOnDesktop ? ' · ' : ''}
              {button.showOnDesktop ? 'Desktop' : ''}
            </span>
            {allowedCount > 0 && <span>Allowed: {allowedCount}</span>}
            {blockedCount > 0 && <span>Blocked: {blockedCount}</span>}
            {button.scheduleStart && (
              <span>
                Start: {new Date(button.scheduleStart).toLocaleDateString()}
              </span>
            )}
            {button.scheduleEnd && (
              <span>
                End: {new Date(button.scheduleEnd).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Active</span>
            <Switch
              checked={button.isActive}
              onCheckedChange={(value) => onToggleActive(button, value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={index === 0}
              onClick={onMoveUp}
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={index === total - 1}
              onClick={onMoveDown}
            >
              <MoveDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(button)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDuplicate(button)}
          disabled={duplicating}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {duplicating ? 'Duplicating...' : 'Duplicate'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!publicUrl}
          onClick={openPreview}
        >
          <Gauge className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(button)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </Button>
      </div>
    </Card>
  );
}
