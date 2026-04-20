'use client';

import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Loader2,
  Rows3,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toaster } from '@/components/ui/toaster';
import {
  createLinkButton,
  CreateLinkButtonPayload,
  deleteLinkButton,
  fetchLinkPage,
  reorderLinkButtons,
  trackTestConversion,
  updateLinkButton,
} from '@/lib/api/link-pages';
import { LinkButton, LinkPageDetail } from '@/types/link';
import { ButtonFormDialog } from '../../_components/ButtonFormDialog';
import { LinkButtonCard } from '../../_components/LinkButtonCard';
import { LinkPreviewPane } from '../../_components/LinkPreviewPane';
import { LinkShareCard } from '../../_components/LinkShareCard';

export default function LinkPageButtons() {
  const params = useParams();
  const router = useRouter();
  const webSubCategory = params.web_sub_category as string;
  const linkPageId = params.linkPageId as string;

  const [pageData, setPageData] = useState<LinkPageDetail | null>(null);
  const [buttons, setButtons] = useState<LinkButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingButton, setEditingButton] = useState<LinkButton | null>(null);
  const [testingPixel, setTestingPixel] = useState(false);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchLinkPage(linkPageId);
      const sortedButtons = [...data.buttons].sort((a, b) => a.order - b.order);
      setPageData(data);
      setButtons(sortedButtons);
      setOrderDirty(false);
    } catch (error: any) {
      toaster({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to load link page',
        condition: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (linkPageId) {
      fetchData();
    }
  }, [linkPageId]);

  // Strict grouping by section label
  const groupedSections = useMemo(() => {
    const sorted = [...buttons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const map = new Map<string, LinkButton[]>();
    const order: string[] = [];

    sorted.forEach((btn) => {
      const label = btn.sectionLabel?.trim() || '';
      if (!map.has(label)) {
        map.set(label, []);
        order.push(label);
      }
      map.get(label)!.push(btn);
    });

    return order.map((label) => ({
      label: label || null,
      buttons: map.get(label)!,
    }));
  }, [buttons]);

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === groupedSections.length - 1) return;

    const newSections = [...groupedSections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];

    // Flatten and reassign order
    const newButtons: LinkButton[] = [];
    let currentOrder = 0;
    newSections.forEach((section) => {
      section.buttons.forEach((btn) => {
        newButtons.push({ ...btn, order: currentOrder++ });
      });
    });

    setButtons(newButtons);
    setOrderDirty(true);
  };

  const handleMoveButton = (btnId: string, direction: 'up' | 'down') => {
    const sectionIndex = groupedSections.findIndex((s) =>
      s.buttons.some((b) => b.id === btnId),
    );
    if (sectionIndex === -1) return;

    const section = groupedSections[sectionIndex];
    const btnIndex = section.buttons.findIndex((b) => b.id === btnId);

    if (direction === 'up' && btnIndex === 0) return;
    if (direction === 'down' && btnIndex === section.buttons.length - 1) return;

    const newSectionButtons = [...section.buttons];
    const targetIndex = direction === 'up' ? btnIndex - 1 : btnIndex + 1;
    [newSectionButtons[btnIndex], newSectionButtons[targetIndex]] = [
      newSectionButtons[targetIndex],
      newSectionButtons[btnIndex],
    ];

    const newButtons: LinkButton[] = [];
    let currentOrder = 0;
    groupedSections.forEach((s, idx) => {
      const btns = idx === sectionIndex ? newSectionButtons : s.buttons;
      btns.forEach((b) => {
        newButtons.push({ ...b, order: currentOrder++ });
      });
    });

    setButtons(newButtons);
    setOrderDirty(true);
  };

  const handleSaveOrder = async () => {
    try {
      setSavingOrder(true);
      await reorderLinkButtons(
        linkPageId,
        buttons.map((btn, index) => ({ id: btn.id, order: index })),
      );
      toaster({
        title: 'Order saved',
        description: 'Button order updated',
        condition: 'success',
      });
      fetchData();
    } catch (error: any) {
      toaster({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save order',
        condition: 'warning',
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDelete = async (button: LinkButton) => {
    if (!confirm(`Delete button "${button.title}"?`)) return;
    try {
      await deleteLinkButton(button.id);
      toaster({
        title: 'Deleted',
        description: 'Button removed',
        condition: 'success',
      });
      fetchData();
    } catch (error: any) {
      toaster({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete button',
        condition: 'warning',
      });
    }
  };

  const handleToggleActive = async (button: LinkButton, nextValue: boolean) => {
    try {
      await updateLinkButton(button.id, { isActive: nextValue });
      setButtons((prev) =>
        prev.map((b) =>
          b.id === button.id ? { ...b, isActive: nextValue } : b,
        ),
      );
    } catch (error: any) {
      toaster({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        condition: 'warning',
      });
    }
  };

  const handleDuplicate = async (button: LinkButton) => {
    try {
      setDuplicateId(button.id);
      const payload: CreateLinkButtonPayload = {
        linkPageId,
        title: `${button.title} (Copy)`.trim(),
        subtitle: button.subtitle || undefined,
        sectionLabel: button.sectionLabel || undefined,
        url: button.url,
        icon: button.icon || undefined,
        iconType: button.iconType || undefined,
        type: button.type,
        color: button.color || undefined,
        textColor: button.textColor || undefined,
        borderRadius: button.borderRadius || undefined,
        order: buttons.length,
        showOnMobile: button.showOnMobile,
        showOnDesktop: button.showOnDesktop,
        allowedCountries: button.allowedCountries || undefined,
        isActive: button.isActive,
      };

      const created = await createLinkButton(payload);
      const advancedPayload = {
        thumbnail: button.thumbnail || undefined,
        price: button.price || undefined,
        scheduleStart: button.scheduleStart || undefined,
        scheduleEnd: button.scheduleEnd || undefined,
        blockedCountries: button.blockedCountries || undefined,
        abVariant: button.abVariant || undefined,
      };
      if (
        Object.values(advancedPayload).some(
          (value) => value !== undefined && value !== null && value !== '',
        )
      ) {
        await updateLinkButton(created.id, advancedPayload);
      }
      toaster({
        title: 'Duplicated',
        description: 'Button copied',
        condition: 'success',
      });
      fetchData();
    } catch (error: any) {
      toaster({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to duplicate',
        condition: 'warning',
      });
    } finally {
      setDuplicateId(null);
    }
  };

  const handleTestConversion = async () => {
    try {
      setTestingPixel(true);
      await trackTestConversion(linkPageId);
      toaster({
        title: 'Pixel test sent',
        description: 'Check your Events Manager',
        condition: 'success',
      });
    } catch (error: any) {
      toaster({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to send test conversion',
        condition: 'warning',
      });
    } finally {
      setTestingPixel(false);
    }
  };

  const nextOrder = buttons.length;

  const headerActions = (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          router.push(
            `/${webSubCategory}/admin/link-pages/${linkPageId}/analytics`,
          )
        }
      >
        <LayoutDashboard className="mr-2 h-4 w-4" /> Analytics
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          router.push(`/${webSubCategory}/admin/link-pages/edit/${linkPageId}`)
        }
      >
        <Rows3 className="mr-2 h-4 w-4" /> Edit Page
      </Button>
      <Button onClick={() => setDialogOpen(true)}>Add Button</Button>
    </div>
  );

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/${webSubCategory}/admin/link-pages`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Button Manager</h1>
            <p className="text-muted-foreground">
              Create, reorder, and optimize buttons for{' '}
              {pageData?.title || 'this page'}.
            </p>
          </div>
        </div>
        {headerActions}
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : pageData ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Snapshot</CardTitle>
                <CardDescription>
                  Monitor total engagement for this Link-in-Bio.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="text-2xl font-semibold">
                    {pageData.totalViews ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="text-2xl font-semibold">
                    {pageData.totalClicks ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-2xl font-semibold">
                    {pageData.conversionCount ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Buttons</p>
                  <p className="text-2xl font-semibold">{buttons.length}</p>
                </div>
              </CardContent>
            </Card>

            <LinkShareCard
              linkPage={pageData}
              sendingTest={testingPixel}
              onSendTest={handleTestConversion}
            />

            <Card>
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>
                    Drag order via controls and publish instantly.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(true)}
                  >
                    Create Button
                  </Button>
                  <Button
                    variant="default"
                    disabled={!orderDirty || savingOrder}
                    onClick={handleSaveOrder}
                    className="gap-2"
                  >
                    {savingOrder && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Save Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {buttons.length === 0 ? (
                  <div className="rounded-3xl border border-dashed p-8 text-center text-muted-foreground">
                    No buttons yet. Create your first CTA to start driving
                    clicks.
                  </div>
                ) : (
                  groupedSections.map((group, groupIndex) => (
                    <div
                      key={group.label || 'default'}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 pb-2 border-b">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          {group.label || 'Uncategorized'}
                        </h3>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={groupIndex === 0}
                            onClick={() => handleMoveSection(groupIndex, 'up')}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={groupIndex === groupedSections.length - 1}
                            onClick={() =>
                              handleMoveSection(groupIndex, 'down')
                            }
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {group.buttons.map((button, btnIndex) => (
                          <LinkButtonCard
                            key={button.id}
                            button={button}
                            index={btnIndex}
                            total={group.buttons.length}
                            slug={pageData.slug}
                            onEdit={(btn) => {
                              setEditingButton(btn);
                              setDialogOpen(true);
                            }}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                            onMoveUp={() => handleMoveButton(button.id, 'up')}
                            onMoveDown={() =>
                              handleMoveButton(button.id, 'down')
                            }
                            onToggleActive={handleToggleActive}
                            duplicating={duplicateId === button.id}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <LinkPreviewPane
              page={pageData}
              buttons={buttons}
            />
          </aside>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed p-8 text-center text-muted-foreground">
          Link page not found.
        </div>
      )}

      {pageData && (
        <ButtonFormDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingButton(null);
          }}
          mode={editingButton ? 'edit' : 'create'}
          linkPageId={linkPageId}
          button={editingButton}
          nextOrder={nextOrder}
          onSuccess={() => {
            setDialogOpen(false);
            setEditingButton(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
