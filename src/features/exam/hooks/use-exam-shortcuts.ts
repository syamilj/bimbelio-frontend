'use client';

import { useEffect, useRef } from 'react';

export type ExamShortcutHandlers = {
  /** Huruf A–E → indeks opsi 0–4. */
  onOption: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFlag: () => void;
};

const isTyping = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLSelectElement) return true;
  return (
    target instanceof HTMLInputElement &&
    !['radio', 'checkbox', 'button', 'submit'].includes(target.type)
  );
};

/** Ada dialog/sheet terbuka → pintasan ruang ujian tidak berlaku. */
const dialogOpen = () =>
  !!document.querySelector(
    '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]',
  );

/**
 * Pintasan keyboard ruang ujian: A–E pilih opsi, N/P soal berikut/sebelum,
 * R tandai ragu. Diabaikan saat mengetik, saat dialog terbuka, atau bila
 * tombol pengubah (Ctrl/⌘/Alt) ditekan.
 */
export function useExamShortcuts(handlers: ExamShortcutHandlers, enabled = true) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTyping(e.target) || dialogOpen()) return;
      const key = e.key.toLowerCase();
      const h = ref.current;
      if (key.length === 1 && key >= 'a' && key <= 'e') {
        e.preventDefault();
        h.onOption(key.charCodeAt(0) - 97);
      } else if (key === 'n') {
        e.preventDefault();
        h.onNext();
      } else if (key === 'p') {
        e.preventDefault();
        h.onPrev();
      } else if (key === 'r') {
        e.preventDefault();
        h.onToggleFlag();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}
