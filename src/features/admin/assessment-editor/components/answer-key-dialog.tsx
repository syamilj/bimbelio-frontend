'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { answerKey } from '../model/scoring';
import type { EditorSession } from '../model/types';

/** Kunci jawaban semua sesi (huruf opsi benar per nomor). */
export function AnswerKeyDialog({
  sessions,
  children,
}: {
  sessions: EditorSession[];
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kunci jawaban</DialogTitle>
          <DialogDescription>
            Jawaban benar per soal, sesuai draf yang sedang disunting.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          {sessions.map((session, si) => (
            <section
              key={si}
              aria-labelledby={`key-${si}`}
              className="flex flex-col gap-2 border-t border-line pt-4 first:border-0 first:pt-0"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3
                  id={`key-${si}`}
                  className="font-display text-base font-bold tracking-display text-ink"
                >
                  Sesi {si + 1}: {session.name || 'tanpa judul'}
                </h3>
                <span className="font-mono text-xs text-ink-muted">
                  {session.Questions.length} soal
                </span>
              </div>
              <ol className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
                {session.Questions.map((q) => (
                  <li
                    key={q.number}
                    className="flex items-center justify-between rounded-sm border border-line px-2 py-1.5 font-mono text-xs"
                  >
                    <span className="text-ink-muted">{q.number}.</span>
                    <span className="font-medium text-ink">
                      {answerKey(q.Answers, session.assessmentType)}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
