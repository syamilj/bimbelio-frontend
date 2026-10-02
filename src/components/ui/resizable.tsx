'use client';

import { GripVertical } from 'lucide-react';
import * as React from 'react';
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
} from 'react-resizable-panels';

import { cn } from '@/lib/utils';

// react-resizable-panels v4: angka pada ukuran panel berarti piksel.
// Wrapper ini mempertahankan kontrak lama (angka = persen) agar pemanggil
// tidak berubah perilaku.
const toPercent = (size?: number | string) =>
  typeof size === 'number' ? `${size}%` : size;

type GroupProps = Omit<React.ComponentProps<typeof Group>, 'orientation'> & {
  direction?: 'horizontal' | 'vertical';
  /** Simpan layout di localStorage dengan kunci ini. */
  autoSaveId?: string;
};

function PersistedGroup({
  autoSaveId,
  ...props
}: Omit<GroupProps, 'direction' | 'autoSaveId'> & {
  autoSaveId: string;
  orientation: 'horizontal' | 'vertical';
}) {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: autoSaveId,
  });
  return (
    <Group
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      {...props}
    />
  );
}

function ResizablePanelGroup({
  className,
  direction = 'horizontal',
  autoSaveId,
  ...props
}: GroupProps) {
  const shared = {
    ...props,
    orientation: direction,
    'data-panel-group-direction': direction,
    className: cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className,
    ),
  };
  return autoSaveId ? (
    <PersistedGroup
      autoSaveId={autoSaveId}
      {...shared}
    />
  ) : (
    <Group {...shared} />
  );
}

function ResizablePanel({
  defaultSize,
  minSize,
  maxSize,
  collapsedSize,
  ...props
}: React.ComponentProps<typeof Panel>) {
  return (
    <Panel
      defaultSize={toPercent(defaultSize)}
      minSize={toPercent(minSize)}
      maxSize={toPercent(maxSize)}
      collapsedSize={toPercent(collapsedSize)}
      {...props}
    />
  );
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) {
  return (
    <Separator
      className={cn(
        'relative flex w-px items-center justify-center bg-line focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-5 w-3 items-center justify-center rounded-sm border border-line bg-surface">
          <GripVertical className="size-3" />
        </div>
      )}
    </Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
