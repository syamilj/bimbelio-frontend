/**
 * Mock API mesin ujian (tryout BimArena) untuk E2E. Berkeadaan: setiap
 * kombinasi token × tryoutId punya progres sendiri, jadi tes paralel aman
 * selama memakai id tryout unik (mis. `to-e2e-<acak>`). Data fiktif.
 */

type Handler = (req: Request, url: URL) => Response | Promise<Response>;

const ok = (data: unknown) => Response.json({ status: 200, message: 'OK', data });
const fail = (status: number, message: string) =>
  Response.json({ status, message, data: null }, { status });

const tokenOf = (req: Request) =>
  req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? 'anon';

type Answer = { questionId: string; answerId: string; notSure: boolean };
type Participant = {
  id: string;
  startSession: string;
  endSession: string | null;
  isDone: boolean;
  answers: Answer[];
};
type State = {
  participants: Record<string, Participant>;
  drafts: Record<string, { answers: Answer[]; updatedAt: string }>;
};

const states = new Map<string, State>();
const stateFor = (token: string, tryoutId: string) => {
  const key = `${token}:${tryoutId}`;
  let s = states.get(key);
  if (!s) {
    s = { participants: {}, drafts: {} };
    states.set(key, s);
  }
  return s;
};

const SUBTESTS = [
  { code: 'pu', name: 'Penalaran Umum' },
  { code: 'pk', name: 'Pengetahuan Kuantitatif' },
];

const questionsFor = (tryoutId: string, sessionId: string, n: number) =>
  Array.from({ length: 3 }, (_, i) => {
    const id = `${sessionId}-q${i + 1}`;
    return {
      id,
      number: i + 1,
      sessionId,
      type: 'OBJECTIVE_5',
      question:
        i === 0
          ? `<p>Jika $x^2 = ${(n + 1) * 4}$ dan $x > 0$, berapakah nilai $x$?</p>`
          : `<p>Soal ${i + 1} subtes ${n + 1}: pilih jawaban yang paling tepat.</p>`,
      explanation: `<p>Pembahasan soal ${i + 1}. Jawaban benar adalah A.</p>`,
      TryoutAnswers: ['A', 'B', 'C', 'D', 'E'].map((l, k) => ({
        id: `${id}-${l.toLowerCase()}`,
        questionId: id,
        answer: `<p>Pilihan ${l}${i === 0 ? ` ($${(n + 1) * 2 + k}$)` : ''}</p>`,
        value: k === 0 ? 5 : 0,
      })),
      Pivot_TryoutQuestion_CourseChapter: [],
      _tryoutId: tryoutId,
    };
  });

const now = () => new Date().toISOString();
const DAY = 86_400_000;

function buildTryout(tryoutId: string, s: State) {
  const sessions = SUBTESTS.map((sub, n) => {
    const id = `${tryoutId}-${sub.code}`;
    const p = s.participants[id];
    const questions = questionsFor(tryoutId, id, n).map(({ _tryoutId, ...q }) =>
      p?.isDone
        ? q
        : {
            ...q,
            explanation: undefined,
            TryoutAnswers: q.TryoutAnswers.map(({ value: _value, ...a }) => a),
          },
    );
    return {
      id,
      number: n + 1,
      name: sub.name,
      duration: 30,
      assessmentType: 'IRT',
      TryoutCategory: { id: 'tps', name: 'TPS' },
      TryoutSubCategory: { id: sub.code, name: sub.name },
      TryoutQuestion: questions,
      TryoutSessionParticipant: p
        ? {
            id: p.id,
            userId: 'u',
            sessionId: id,
            startSession: p.startSession,
            endSession: p.endSession,
            isDone: p.isDone,
          }
        : null,
    };
  });
  return {
    id: tryoutId,
    title: 'TO UTBK E2E',
    restTime: 1,
    startDate: new Date(Date.now() - DAY).toISOString(),
    endDate: new Date(Date.now() + DAY).toISOString(),
    resultDate: new Date(Date.now() - 1000).toISOString(),
    isFirstQuizInVolume: null,
    serverTime: now(),
    TryoutSession: sessions,
    TryoutRegistration: [{ id: 'reg' }],
  };
}

const sessionScore = (tryoutId: string, sessionId: string, s: State) => {
  const n = SUBTESTS.findIndex((sub) => sessionId.endsWith(`-${sub.code}`));
  const qs = questionsFor(tryoutId, sessionId, n);
  const answers = s.participants[sessionId]?.answers ?? [];
  const correct = qs.filter((q) =>
    answers.some((a) => a.questionId === q.id && a.answerId === `${q.id}-a`),
  ).length;
  return { correct, total: qs.length, score: 300 + correct * 150 };
};

const tryoutIdOf = (sessionId: string) =>
  sessionId.replace(/-(pu|pk)$/, '');

export const EXAM_ROUTES: Record<string, Handler> = {
  'GET /tryout/getTryoutById': (req, url) => {
    const id = url.searchParams.get('tryoutId') ?? '';
    if (!id.startsWith('to-')) return fail(404, 'data tidak ditemukan!');
    return ok(buildTryout(id, stateFor(tokenOf(req), id)));
  },
  'POST /tryoutSession/createTryoutSessionParticipant': async (req) => {
    const { sessionId } = (await req.json()) as { sessionId: string };
    const s = stateFor(tokenOf(req), tryoutIdOf(sessionId));
    s.participants[sessionId] ??= {
      id: `p-${sessionId}`,
      startSession: now(),
      endSession: null,
      isDone: false,
      answers: [],
    };
    return ok(null);
  },
  'PUT /tryoutSession/saveDraft': async (req) => {
    const { sessionId, answers } = (await req.json()) as {
      sessionId: string;
      answers: Answer[];
    };
    const s = stateFor(tokenOf(req), tryoutIdOf(sessionId));
    if (s.participants[sessionId]?.isDone) return fail(409, 'Sesi sudah diselesaikan');
    s.drafts[sessionId] = { answers, updatedAt: now() };
    return ok({ updatedAt: s.drafts[sessionId].updatedAt });
  },
  'GET /tryoutSession/getDraft': (req, url) => {
    const sessionId = url.searchParams.get('sessionId') ?? '';
    const s = stateFor(tokenOf(req), tryoutIdOf(sessionId));
    if (s.participants[sessionId]?.isDone) return ok(null);
    return ok(s.drafts[sessionId] ?? null);
  },
  'POST /tryoutSession/finishSession': async (req) => finish(req),
  'POST /tryoutSession/finishSessionLate': async (req) => finish(req),
  'GET /tryoutSession/getTryoutSessionResult': (req, url) => {
    const sessionId = url.searchParams.get('sessionId') ?? '';
    const tryoutId = tryoutIdOf(sessionId);
    const s = stateFor(tokenOf(req), tryoutId);
    const p = s.participants[sessionId];
    if (!p) return fail(404, 'Peserta sesi tidak ditemukan!');
    const n = SUBTESTS.findIndex((sub) => sessionId.endsWith(`-${sub.code}`));
    const qs = questionsFor(tryoutId, sessionId, n);
    return ok({
      id: p.id,
      startSession: p.startSession,
      endSession: p.endSession,
      totalScore: sessionScore(tryoutId, sessionId, s).score,
      TryoutSession: { id: sessionId, name: SUBTESTS[n].name, Document: null },
      TryoutUserAnswer: qs.map(({ _tryoutId, ...q }) => {
        const a = p.answers.find((x) => x.questionId === q.id);
        const picked = q.TryoutAnswers.find((o) => o.id === a?.answerId) ?? null;
        return {
          id: `ua-${q.id}`,
          questionId: q.id,
          answerId: picked?.id ?? null,
          TryoutAnswers: picked,
          TryoutQuestion: q,
          difficultyQuestion: { message: 'Sedang', value: 3 },
        };
      }),
    });
  },
  'GET /tryout/getAnalisisByTryoutId': (req, url) => {
    const tryoutId = url.searchParams.get('tryoutId') ?? '';
    const s = stateFor(tokenOf(req), tryoutId);
    const sessionResult = SUBTESTS.map((sub) => {
      const id = `${tryoutId}-${sub.code}`;
      const r = sessionScore(tryoutId, id, s);
      return {
        id: `res-${sub.code}`,
        category: 'TPS',
        subCategory: sub.name,
        correctAnswers: r.correct,
        wrongAnswers: r.total - r.correct,
        totalQuestions: r.total,
        score: r.score,
        totalParticipants: 120,
        ranking: 30,
      };
    });
    const userScore =
      sessionResult.reduce((a, r) => a + r.score, 0) / sessionResult.length;
    return ok({
      userScore,
      totalParticipants: 120,
      summaryTryout: {
        userScore,
        sessionResult,
        Result: [
          {
            category: 'TPS',
            data: sessionResult.map(({ category: _category, subCategory, ...r }) => ({
              ...r,
              title: subCategory,
            })),
          },
        ],
      },
      choiceAnalisis: {
        userScore,
        rankingTryout: 27,
        tryoutPersentage: 78,
        rankingUniv: 12,
        rankingMajor: 5,
        university: [
          {
            univ: 'Universitas Contoh',
            univAverageScore: 520,
            major: 'Teknik Informatika',
            majorAverageScore: 610,
            univRanking: 12,
            univPercentage: 70,
            univTotalAplicants: 40,
            majorRanking: 5,
            majorPercentage: 60,
            majorTotalAplicants: 12,
          },
        ],
      },
      TryoutSession: sessionResult.map((r) => ({
        userScore: r.score,
        totalParticipants: 120,
      })),
    });
  },
  'GET /tryout/getTryoutUnlockByTryoutId': () => ok(true),
  'GET /tryout/getTryoutUserProgress': () =>
    ok([
      { name: 'TO UTBK #01', score: 410 },
      { name: 'TO UTBK E2E', score: 450 },
    ]),
  'GET /user/getUserTryOut': () =>
    ok({
      id: 'acc',
      userTryOutId: 'uto-1',
      univChoiceOne: 'Universitas Contoh',
      univStudyChoiceOne: 'Teknik Informatika',
      univChoiceTwo: null,
      univStudyChoiceTwo: null,
      targetValue: 600,
    }),
  'GET /universitas': () =>
    ok([
      {
        university: 'Universitas Contoh',
        initials: 'UC',
        averageScore: 520,
        referensi: null,
        studyProgramList: [
          { study: 'Teknik Informatika', averageScore: 610 },
          { study: 'Matematika', averageScore: 480 },
        ],
      },
    ]),
  'GET /tryout/getSimulationDataByTryoutId': () => ok(null),
  'GET /chatTryout/getAllMessageByParticipantId': () => ok([]),
};

async function finish(req: Request) {
  const { sessionId, answer } = (await req.json()) as {
    sessionId: string;
    answer: Answer[];
  };
  const s = stateFor(tokenOf(req), tryoutIdOf(sessionId));
  const p = (s.participants[sessionId] ??= {
    id: `p-${sessionId}`,
    startSession: now(),
    endSession: null,
    isDone: false,
    answers: [],
  });
  if (!p.isDone) {
    p.isDone = true;
    p.endSession = now();
    p.answers = answer;
    delete s.drafts[sessionId];
  }
  return ok(null);
}
