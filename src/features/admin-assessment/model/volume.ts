// Urutan quiz di dalam volume: `quizOrder` dihitung per subtes (1..n).

import type { VolumeQuiz } from './types';

const byOrder = (a: VolumeQuiz, b: VolumeQuiz) =>
  (a.quizOrder || 10000) - (b.quizOrder || 10000);

/**
 * Nomori ulang `quizOrder` per subtes mengikuti urutan `subCategoryIds`.
 * Quiz dari subtes yang tidak dikenal tetap disertakan di akhir.
 */
export function normalizeOrders(
  quizzes: VolumeQuiz[],
  subCategoryIds: string[],
): VolumeQuiz[] {
  const groups = [
    ...subCategoryIds,
    ...new Set(
      quizzes
        .map((q) => q.TryoutSubCategory.id)
        .filter((id) => !subCategoryIds.includes(id)),
    ),
  ];
  return groups.flatMap((sub) =>
    quizzes
      .filter((q) => q.TryoutSubCategory.id === sub)
      .sort(byOrder)
      .map((q, i) => ({ ...q, quizOrder: i + 1 })),
  );
}

/** Pindahkan satu quiz ke urutan `target` (1-based) di subtesnya. */
export function reorderWithinSubCategory(
  quizzes: VolumeQuiz[],
  quizId: string,
  target: number,
): VolumeQuiz[] {
  const moving = quizzes.find((q) => q.id === quizId);
  if (!moving) return quizzes;
  const sub = moving.TryoutSubCategory.id;
  const group = quizzes
    .filter((q) => q.TryoutSubCategory.id === sub)
    .sort(byOrder)
    .filter((q) => q.id !== quizId);
  const pos = Math.max(1, Math.min(target, group.length + 1));
  group.splice(pos - 1, 0, moving);
  return [
    ...quizzes.filter((q) => q.TryoutSubCategory.id !== sub),
    ...group.map((q, i) => ({ ...q, quizOrder: i + 1 })),
  ];
}

export function toggleQuiz(
  quizzes: VolumeQuiz[],
  quiz: VolumeQuiz,
  subCategoryIds: string[],
) {
  const exists = quizzes.some((q) => q.id === quiz.id);
  return normalizeOrders(
    exists ? quizzes.filter((q) => q.id !== quiz.id) : [...quizzes, quiz],
    subCategoryIds,
  );
}
