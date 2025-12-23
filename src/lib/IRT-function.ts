import {
  DataIRTProps,
  OverallStatsProps,
} from '@/app/(main)/[web_sub_category]/(admin)/admin/tryout/irt/[tryoutId]/page';
import Papa from 'papaparse';
import { SetStateAction } from 'react';

export const readCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results: any) => {
        if (results.errors && results.errors.length > 0) {
          reject(
            new Error(
              `CSV parsing error: ${results.errors[0].message}. Please check your CSV file format and ensure it uses commas as delimiters.`,
            ),
          );
        } else if (results.data.length === 0) {
          reject(
            new Error(
              'CSV file is empty. Please upload a valid CSV file with data.',
            ),
          );
        } else {
          // Check if the number of fields matches the expected number
          const actualFields = Object.keys(results.data[0]);
          if (actualFields.length < 2) {
            reject(
              new Error(
                `Incorrect number of fields. Expected at least 2 fields (respondent and at least one question), but found ${actualFields.length} fields.`,
              ),
            );
          } else {
            resolve(results.data as any[]);
          }
        }
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        reject(
          new Error(
            `CSV parsing error: ${error.message}. Please check your CSV file format and ensure it uses commas as delimiters.`,
          ),
        );
      },
    });
  });
};

const calculateProbability = (
  theta: number,
  a: number,
  b: number,
  c: number,
): number => {
  const exponent = -1.7 * a * (theta - b);
  const logistic = 1.0 / (1.0 + Math.exp(exponent));
  return c + (1 - c) * logistic;
};

const logLikelihood = (
  theta: number,
  responses: number[],
  parameterIrt: number[][],
): number => {
  const probabilities = parameterIrt.map(([a, b, c]) =>
    calculateProbability(theta, a, b, c),
  );
  const clippedProbabilities = probabilities.map((p) =>
    Math.min(Math.max(p, 1e-9), 1 - 1e-9),
  );

  return responses.reduce((sum, response, i) => {
    const p = clippedProbabilities[i];
    return sum + (response * Math.log(p) + (1 - response) * Math.log(1 - p));
  }, 0);
};

// itemParams [a,b,c]
// responses = [1, 0] question benar salah
const eapEstimate = (responses: number[], parameterIrt: number[][]): number => {
  const thetaGrid = Array.from({ length: 801 }, (_, i) => -4 + i * 0.01);
  const prior = thetaGrid.map(
    (theta) => Math.exp(-0.5 * theta ** 2) / Math.sqrt(2 * Math.PI),
  );
  const likelihoods = thetaGrid.map((theta) =>
    Math.exp(logLikelihood(theta, responses, parameterIrt)),
  );
  const posterior = likelihoods.map((likelihood, i) => likelihood * prior[i]);
  const posteriorSum = posterior.reduce((sum, p) => sum + p, 0);

  return (
    posterior.reduce((sum, p, i) => sum + p * thetaGrid[i], 0) / posteriorSum
  );
};

const transformToSNBT = ({
  thetas,
  maxSNBT,
}: {
  thetas: {
    p: any;
    theta: number;
  }[];
  maxSNBT: number;
}): {
  p: any;
  score: number;
}[] => {
  const meanTheta = thetas.reduce((sum, t) => sum + t.theta, 0) / thetas.length;
  const stdTheta = Math.sqrt(
    thetas.reduce((sum, t) => sum + (t.theta - meanTheta) ** 2, 0) /
      thetas.length,
  );
  return thetas.map((theta) => {
    const scaled = 500 + (100 * (theta.theta - meanTheta)) / stdTheta;
    return {
      p: theta.p,
      score: Math.min(Math.max(scaled, 0), maxSNBT),
    };
  });
};

// const transformToSNBT = ({
//   thetas,
//   maxSNBT,
// }: {
//   thetas: number[];
//   maxSNBT: number;
// }): number[] => {
//   const meanTheta = thetas.reduce((sum, t) => sum + t, 0) / thetas.length;
//   const stdTheta = Math.sqrt(
//     thetas.reduce((sum, t) => sum + (t - meanTheta) ** 2, 0) / thetas.length,
//   );
//   return thetas.map((theta) => {
//     const scaled = 500 + (100 * (theta - meanTheta)) / stdTheta;
//     return Math.min(Math.max(scaled, 0), maxSNBT);
//   });
// };

// function hitungSkorTes(
//   theta: number,
//   theta_min: number,
//   theta_max: number,
//   skalaMin = 0,
//   skalaMax = 1000,
// ) {
//   // Menghitung skor tes menggunakan rumus penskalaan
//   const skorTes =
//     ((theta - theta_min) / (theta_max - theta_min)) * (skalaMax - skalaMin) +
//     skalaMin;
//   return skorTes;
// }

export const processData = async (
  participantFile: File,
  threePLFile: File,
  setProgress: (progress: number) => void,
  setSaveDataIRT: React.Dispatch<SetStateAction<DataIRTProps | null>>,
  setCurrentStep: (step: string) => void,
): Promise<{
  overallStats: OverallStatsProps;
}> => {
  try {
    setProgress(10);
    setCurrentStep('Membaca file parameter item');
    const parameterIrtRows = await readCSV(threePLFile);
    const parameterIrt = parameterIrtRows.map((row) => [
      parseFloat(row.a),
      parseFloat(row.b),
      parseFloat(row.c),
    ]);

    setProgress(30);
    setCurrentStep('Membaca file respons peserta');
    const participantAnswerRows: { [key: string]: string }[] =
      await readCSV(participantFile);
    const participants = participantAnswerRows.map((row) => row.p);
    const participantAnswer = participantAnswerRows.map((row) => {
      const data = Object.keys(row).filter((key) => key.startsWith('q'));
      const value = data.map((key) => parseInt(row[key]));

      return value;
    });

    // if (responsesData[0].length !== 155) {
    //   throw new Error(
    //     `Incorrect number of questions. Expected 155 questions, but found ${responsesData[0].length} questions.`,
    //   );
    // }

    setProgress(50);
    setCurrentStep('Menghitung skor per bagian');

    setProgress(70);
    setCurrentStep('Menghitung theta dan skor SNBT');

    let theta_min = 100;
    let theta_max = 0;
    let score_min = 1000;
    let score_max = 0;
    let total_score = 0;
    let total_theta = 0;

    const participantTheta = participantAnswer.map((item, index) => {
      const theta = eapEstimate(item, parameterIrt);
      total_theta += theta;
      if (theta > theta_max) theta_max = theta;
      if (theta < theta_min) theta_min = theta;

      return {
        p: participants[index],
        theta,
      };
    });
    // const thetas = participantTheta.map((item) => item.theta); // [0.1, 0.121]

    const scores = transformToSNBT({ thetas: participantTheta, maxSNBT: 1000 }); // [100, 200 ,300]

    const participantScore = participantTheta.map((item) => {
      //   const score = hitungSkorTes(item.theta, theta_min, theta_max);
      const score = scores.find((item2) => item2.p === item.p)?.score;
      if (!score) {
        return {
          ...item,
          score: 0,
        };
      }

      total_score += score;
      if (score > score_max) score_max = score;
      if (score < score_min) score_min = score;
      return {
        ...item,
        score,
      };
    });

    setProgress(90);
    setCurrentStep('Mengkalkulasi statistik keseluruhan');

    const allScores = participantScore.map((item) => item.score);
    allScores.sort((a, b) => a - b); // Urutkan skor secara ascending

    let medianScores = 0;
    const middleIndex = Math.floor(allScores.length / 2);

    if (allScores.length % 2 === 0) {
      // Jika jumlah skor genap, ambil rata-rata dari dua nilai tengah
      medianScores = (allScores[middleIndex - 1] + allScores[middleIndex]) / 2;
    } else {
      // Jika jumlah skor ganjil, ambil nilai tengah
      medianScores = allScores[middleIndex];
    }

    const overallStats = {
      totalParticipants: participants.length,
      averageScores: total_score / participants.length,
      averageTheta: total_theta / participants.length,
      minScores: score_min,
      maxScores: score_max,
      medianScores: medianScores,
      minTheta: theta_min,
      maxTheta: theta_max,
    };

    setProgress(100);
    setCurrentStep('Selesai');
    setSaveDataIRT({
      question: parameterIrt.map((item, index) => {
        return {
          q: index + 1,
          a: parseFloat(parameterIrtRows[index].a),
          b: parseFloat(parameterIrtRows[index].b),
          c: parseFloat(parameterIrtRows[index].c),
        };
      }),
      participants: participantScore,
    });
    return { overallStats };
  } catch (error) {
    console.error('Error in processData:', error);
    throw error;
  }
};
