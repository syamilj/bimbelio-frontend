import { Subcategory } from "@/types/database";
import { ColorList } from "./_color-list";

type useUserProgressType = {
    UserProgress: {
        chart: {
            lineChartData: Record<string, string | number>[];
            radarChartData: {
                subject: string;
                userScore: number;
                avgScore: number;
                fullMark: number;
            }[];
            subCategories: (Subcategory & {
                code: string;
                color: string;
            })[];
        };
        progress: {
            totalQuiz: number;
            totalQuizFinished: number;
            percentage: number;
            subCategories: {
                name: string;
                total: number;
                totalFinished: number;
                percentage: number;
            }[];
        };
        answerAnalysis: {
            totalQuestion: number;
            correctAnswers: number;
            wrongAnswers: number;
            notAnswered: number;
        };
    }
}

// {
//     "lineChartData": [
//         {
//             "quiz": "Quiz-1",
//             "cmdx4ptxn000mkug4yys3oux6": 60,
//             "cmdx4r13z000skug426iwccr9": 70,
//             "cmdx4rdkf000ukug4kpjs9opl": 80
//         },
//         {
//             "quiz": "Quiz-2",
//             "cmdx4ptxn000mkug4yys3oux6": 50,
//             "cmdx4r13z000skug426iwccr9": 90,
//             "cmdx4rdkf000ukug4kpjs9opl": 70
//         },
//         {
//             "quiz": "Quiz-3",
//             "cmdx4r13z000skug426iwccr9": 80,
//             "cmdx4rdkf000ukug4kpjs9opl": 80
//         }
//     ],
//         "radarChartData": [
//             {
//                 "subject": "PU",
//                 "userScore": 55,
//                 "avgScore": 0,
//                 "fullMark": 100
//             },
//             {
//                 "subject": "PK",
//                 "userScore": 80,
//                 "avgScore": 0,
//                 "fullMark": 100
//             },
//             {
//                 "subject": "LBI",
//                 "userScore": 76.66666666666667,
//                 "avgScore": 0,
//                 "fullMark": 100
//             }
//         ],
//             "subCategories": [
//                 {
//                     "id": "cmdx4ptxn000mkug4yys3oux6",
//                     "name": "Penalaran Umum",
//                     "categoryId": "cmdx4ns07000ikug40hzdaanz",
//                     "website_sub_category_id": "snbt",
//                     "code": "PU",
//                     "color": "#0091FF"
//                 },
//                 {
//                     "id": "cmdx4r13z000skug426iwccr9",
//                     "name": "Pengetahuan Kuantitatif",
//                     "categoryId": "cmdx4ns07000ikug40hzdaanz",
//                     "website_sub_category_id": "snbt",
//                     "code": "PK",
//                     "color": "#22c55e"
//                 },
//                 {
//                     "id": "cmdx4rdkf000ukug4kpjs9opl",
//                     "name": "Literasi Bahasa Indonesia",
//                     "categoryId": "cmdx4oawq000kkug4i7ec3pye",
//                     "website_sub_category_id": "snbt",
//                     "code": "LBI",
//                     "color": "#eab308"
//                 }
//             ]
// }

export const useUserProgress: useUserProgressType = {
    UserProgress: {
        chart: {
            lineChartData: [
                { quiz: "Quiz-1", subcat_001: 85, subcat_002: 80, subcat_003: 90, subcat_004: 75, subcat_005: 70, subcat_006: 78 },
                { quiz: "Quiz-2", subcat_001: 88, subcat_002: 85, subcat_003: 92, subcat_004: 80, subcat_005: 75, subcat_006: 82 },
                { quiz: "Quiz-3", subcat_001: 82, subcat_002: 78, subcat_003: 88, subcat_004: 76, subcat_005: 72, subcat_006: 80 },
                { quiz: "Quiz-4", subcat_001: 90, subcat_002: 87, subcat_003: 95, subcat_004: 84, subcat_005: 78, subcat_006: 85 },
                { quiz: "Quiz-5", subcat_001: 86, subcat_002: 82, subcat_003: 91, subcat_004: 79, subcat_005: 74, subcat_006: 81 },
                { quiz: "Quiz-6", subcat_001: 89, subcat_002: 86, subcat_003: 94, subcat_004: 82, subcat_005: 77, subcat_006: 84 },
            ],
            radarChartData: [
                {
                    subject: "ARITH",
                    userScore: 85,
                    avgScore: 75,
                    fullMark: 100,
                },
                {
                    subject: "ALG",
                    userScore: 80,
                    avgScore: 72,
                    fullMark: 100,
                },
                {
                    subject: "GEOM",
                    userScore: 88,
                    avgScore: 78,
                    fullMark: 100,
                },
                {
                    subject: "TRIG",
                    userScore: 82,
                    avgScore: 70,
                    fullMark: 100,
                },
                {
                    subject: "STAT",
                    userScore: 75,
                    avgScore: 68,
                    fullMark: 100,
                },
                {
                    subject: "PROB",
                    userScore: 78,
                    avgScore: 65,
                    fullMark: 100,
                },
            ],
            subCategories: [
                {
                    website_sub_category_id: "sub-cat-001",
                    id: "subcat_001",
                    name: "Aritmetika",
                    categoryId: "cat-001",
                    visibleAtWebSubIds: ["sub-cat-001"],
                    code: "ARITH",
                    color: ColorList[0 % ColorList.length],
                },
                {
                    website_sub_category_id: "sub-cat-001",
                    id: "subcat_002",
                    name: "Aljabar",
                    categoryId: "cat-001",
                    visibleAtWebSubIds: ["sub-cat-001"],
                    code: "ALG",
                    color: ColorList[1 % ColorList.length],
                },
                {
                    website_sub_category_id: "sub-cat-001",
                    id: "subcat_003",
                    name: "Geometri",
                    categoryId: "cat-001",
                    visibleAtWebSubIds: ["sub-cat-001"],
                    code: "GEOM",
                    color: ColorList[2 % ColorList.length],
                },
                {
                    website_sub_category_id: "sub-cat-001",
                    id: "subcat_004",
                    name: "Trigonometri",
                    categoryId: "cat-001",
                    visibleAtWebSubIds: ["sub-cat-001"],
                    code: "TRIG",
                    color: ColorList[3 % ColorList.length],
                },
                {
                    website_sub_category_id: "sub-cat-001",
                    id: "subcat_005",
                    name: "Statistika",
                    categoryId: "cat-001",
                    visibleAtWebSubIds: ["sub-cat-001"],
                    code: "STAT",
                    color: ColorList[4 % ColorList.length],
                },
                {
                    website_sub_category_id: "sub-cat-001",
                    id: "subcat_006",
                    name: "Probabilitas",
                    categoryId: "cat-001",
                    visibleAtWebSubIds: ["sub-cat-001"],
                    code: "PROB",
                    color: ColorList[5 % ColorList.length],
                },
            ],
        },
        progress: {
            totalQuiz: 30,
            totalQuizFinished: 24,
            percentage: 80,
            subCategories: [
                {
                    name: "Aritmetika",
                    total: 5,
                    totalFinished: 5,
                    percentage: 100,
                },
                {
                    name: "Aljabar",
                    total: 5,
                    totalFinished: 5,
                    percentage: 100,
                },
                {
                    name: "Geometri",
                    total: 5,
                    totalFinished: 4,
                    percentage: 80,
                },
                {
                    name: "Trigonometri",
                    total: 5,
                    totalFinished: 4,
                    percentage: 80,
                },
                {
                    name: "Statistika",
                    total: 5,
                    totalFinished: 3,
                    percentage: 60,
                },
                {
                    name: "Probabilitas",
                    total: 5,
                    totalFinished: 3,
                    percentage: 60,
                },
            ],
        },
        answerAnalysis: {
            totalQuestion: 240,
            correctAnswers: 204,
            wrongAnswers: 28,
            notAnswered: 8,
        },
    },
};