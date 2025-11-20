interface SubtestResult {
  benar: number;
  salah: number;
  kosong: number;
}

export const validateSubtest = (
  subtest: SubtestResult,
  maxQuestions: number,
) => {
  const total = subtest.benar + subtest.salah + subtest.kosong;
  return total === maxQuestions;
};
export const calculateSubtestScore = (subtest: SubtestResult) => {
  const rawScore = subtest.benar * 4 + subtest.salah * -1 + subtest.kosong * 0;
  return 500 + 100 + 125 + rawScore;
};
