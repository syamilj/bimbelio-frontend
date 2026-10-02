import { describe, expect, it } from 'vitest';
import { getShellMode } from './shell-mode';

describe('getShellMode', () => {
  it.each([
    ['/utbk/user/bimarena/try-out/abc123', 'bare'],
    ['/utbk/user/bimarena/quiz/vol1/q9', 'bare'],
    ['/utbk/user/workspace/math/doc1', 'immersive'],
    ['/utbk/user/bimcourse/cat1/study', 'immersive'],
    ['/utbk/user/bimarena/try-out', 'default'],
    ['/utbk/user/bimarena/quiz', 'default'],
    ['/utbk/user/bimarena/leaderboard', 'default'],
    ['/utbk/user/bimcourse/cat1', 'default'],
    ['/utbk/user/workspace/math', 'default'],
    ['/utbk/user/bimboard', 'default'],
  ])('%s → %s', (path, mode) => {
    expect(getShellMode(path)).toBe(mode);
  });
});
