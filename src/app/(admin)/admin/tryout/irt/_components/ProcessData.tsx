import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { processData } from "@/lib/IRT-function";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SetStateAction, useState } from "react";
import { DataIRTProps, OverallStatsProps } from "../[tryoutId]/page";

export default function ProcessData({
  participantFile,
  threePLFile,
  setOverallStats,
  setSaveDataIRT,
}: {
  participantFile: File | null;
  threePLFile: File | null;
  setOverallStats: React.Dispatch<SetStateAction<OverallStatsProps | null>>;
  setSaveDataIRT: React.Dispatch<SetStateAction<DataIRTProps | null>>;
}) {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("");

  const handleProcessData = async () => {
    if (!participantFile || !threePLFile) {
      setError("Mohon unggah kedua file data peserta dan data 3PL.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { overallStats } = await processData(
        participantFile,
        threePLFile,
        setProgress,
        setSaveDataIRT,
        (step: string) => setCurrentStep(step)
      );
      // setResults(results);
      setOverallStats(overallStats);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError(`Terjadi kesalahan saat memproses data: ${
        error instanceof Error ? error.message : String(error)
      }

    Pastikan format CSV Kamu benar:
    - File harus memiliki 156 kolom (1 untuk respondent dan 155 untuk pertanyaan)
    - Gunakan koma (,) sebagai pemisah
    - Baris pertama harus berisi header: respondent,q1,q2,...,q155
    - Setiap baris berikutnya harus berisi data peserta: ID peserta, jawaban untuk q1, q2, ..., q155`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proses Data</CardTitle>
        <CardDescription>
          Analisis data SNBT/UTBK menggunakan metode IRT
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">{currentStep}</p>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              {error.includes("CSV parsing error") && (
                <ul className="list-disc list-inside mt-2">
                  <li>
                    Pastikan file CSV menggunakan koma (,) sebagai pemisah
                  </li>
                  <li>
                    Periksa apakah jumlah kolom sesuai dengan yang diharapkan
                  </li>
                  <li>Pastikan baris pertama berisi nama kolom yang benar</li>
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}
        {progress === 100 && !error && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Sukses</AlertTitle>
            <AlertDescription>Data berhasil diproses</AlertDescription>
          </Alert>
        )}
        <Button onClick={handleProcessData} disabled={isProcessing}>
          {isProcessing ? "Memproses..." : "Proses Data"}
        </Button>
      </CardContent>
    </Card>
  );
}
