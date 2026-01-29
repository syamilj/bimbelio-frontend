type useUserStatisticType = {
    UserStatistic: {
        userStatistic: {
            rank: number;
            accuracy: number;
            totalScore: number;
            totalTryoutFinished: number;
            totalTryout: number;
            userEliminate: number;
            totalParticipant: number;
            averageScore: number;
            topPercentage: number;
            averageTime: number;
        };
        userTarget: {
            targetValue: number;
            univChoiceOne: string;
            univStudyChoiceOne: string;
            univChoiceTwo: string;
            univStudyChoiceTwo: string;
        };
        topFive: {
            image: string | null;
            name: string;
            totalScore: number;
            rank: number;
            maxScore: number;
        }[];
        compareToTop: {
            topNumber: number;
            averageScore: {
                user: number;
                top: number;
            };
            totalScore: {
                user: number;
                top: number;
            };
            accuracy: {
                user: number;
                top: number;
            };
            differenceRank: number;
            subTesGap: {
                id: string;
                name: string;
                code: string;
                gap: {
                    averageScore: {
                        user: number;
                        top: number;
                    };
                    totalScore: {
                        user: number;
                        top: number;
                    };
                    accuracy: {
                        user: number;
                        top: number;
                    };
                };
            }[];
        };
    }

}


export const useUserStatistic: useUserStatisticType = {
    UserStatistic: {
        userStatistic: {
            rank: 15,
            accuracy: 82.5,
            totalScore: 4250,
            totalTryoutFinished: 8,
            totalTryout: 10,
            userEliminate: 2,
            totalParticipant: 1500,
            averageScore: 531.25,
            topPercentage: 12.5,
            averageTime: 45.3,
        },
        userTarget: {
            targetValue: 650,
            univChoiceOne: "Universitas Indonesia",
            univStudyChoiceOne: "Teknik Informatika",
            univChoiceTwo: "Institut Teknologi Bandung",
            univStudyChoiceTwo: "Teknik Komputer",
        },
        topFive: [
            {
                image: "https://example.com/avatar1.jpg",
                name: "Ahmad Rizki",
                totalScore: 5100,
                rank: 1,
                maxScore: 5200,
            },
            {
                image: "https://example.com/avatar2.jpg",
                name: "Siti Nurhaliza",
                totalScore: 4950,
                rank: 2,
                maxScore: 5200,
            },
            {
                image: "https://example.com/avatar3.jpg",
                name: "Budi Santoso",
                totalScore: 4850,
                rank: 3,
                maxScore: 5200,
            },
            {
                image: null,
                name: "Rini Wijaya",
                totalScore: 4750,
                rank: 4,
                maxScore: 5200,
            },
            {
                image: "https://example.com/avatar5.jpg",
                name: "Doni Hermawan",
                totalScore: 4680,
                rank: 5,
                maxScore: 5200,
            },
        ],
        compareToTop: {
            topNumber: 1,
            averageScore: {
                user: 531.25,
                top: 637.5,
            },
            totalScore: {
                user: 4250,
                top: 5100,
            },
            accuracy: {
                user: 82.5,
                top: 95.2,
            },
            differenceRank: 14,
            subTesGap: [
                {
                    id: "math-001",
                    name: "Matematika",
                    code: "MATH",
                    gap: {
                        averageScore: {
                            user: 78.5,
                            top: 92.3,
                        },
                        totalScore: {
                            user: 1150,
                            top: 1386,
                        },
                        accuracy: {
                            user: 78.0,
                            top: 96.5,
                        },
                    },
                },
                {
                    id: "physics-001",
                    name: "Fisika",
                    code: "PHY",
                    gap: {
                        averageScore: {
                            user: 85.2,
                            top: 93.1,
                        },
                        totalScore: {
                            user: 852,
                            top: 931,
                        },
                        accuracy: {
                            user: 84.0,
                            top: 94.8,
                        },
                    },
                },
                {
                    id: "chemistry-001",
                    name: "Kimia",
                    code: "CHEM",
                    gap: {
                        averageScore: {
                            user: 82.0,
                            top: 88.5,
                        },
                        totalScore: {
                            user: 820,
                            top: 885,
                        },
                        accuracy: {
                            user: 82.0,
                            top: 92.0,
                        },
                    },
                },
                {
                    id: "english-001",
                    name: "Bahasa Inggris",
                    code: "ENG",
                    gap: {
                        averageScore: {
                            user: 75.8,
                            top: 88.7,
                        },
                        totalScore: {
                            user: 758,
                            top: 887,
                        },
                        accuracy: {
                            user: 81.0,
                            top: 95.0,
                        },
                    },
                },
            ],
        },
    }

};