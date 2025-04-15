import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toaster } from '@/components/ui/toaster';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import { useState } from 'react';

export default function UploadParticipantData({
  setParticipantFile,
}: {
  setParticipantFile: (file: File | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isTemplateConfirmed, setIsTemplateConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsTemplateConfirmed(false);
      setError(null);
    }
  };

  const confirmTemplate = () => {
    // Here you would typically check the file contents to confirm it matches the expected template
    // For this example, we'll just set it to true
    if (!file) return;
    let error = {
      value: false,
      message: '',
    };
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        const data: any[] = results.data;
        console.log('data', data);
        data.forEach((item, index) => {
          const keys = Object.keys(item);
          console.log({ keys });
          if (index === 0 && keys[0] !== 'p') {
            error = {
              value: true,
              message: 'Tidak Valid',
            };
          } else {
            keys.forEach((key, index) => {
              if (index !== 0) {
                const isIncludedQ = key.includes('q');
                if (!isIncludedQ) {
                  error = {
                    value: true,
                    message: 'Tidak Valid',
                  };
                }
              }
            });
          }
        });
        console.log({ error });
        if (error.value) {
          setError(error.message);
          return;
        }
        setError(null);
        setIsTemplateConfirmed(true);
      },
      error: function (error: any) {
        console.error(error);
        toaster({
          title: 'Upss',
          condition: 'warning',
          description: 'Gagal membaca file CSV!',
        });
      },
    });
  };

  const handleUpload = () => {
    if (!file) {
      setError('Mohon pilih file terlebih dahulu.');
      return;
    }
    if (!isTemplateConfirmed) {
      setError('Mohon konfirmasi template terlebih dahulu.');
      return;
    }
    setParticipantFile(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Data Peserta</CardTitle>
        <CardDescription>
          Unggah file CSV yang berisi data respons peserta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="participant-data">Data Peserta (CSV)</Label>
          <Input
            id="participant-data"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>
        <Alert>
          <AlertTitle>Format CSV yang Diharapkan</AlertTitle>
          <AlertDescription>
            <p>Pastikan file CSV Kamu memiliki format berikut:</p>
            <div className="grid grid-cols-4">
              <p className="border p-2">p</p>
              <p className="border p-2">q1</p>
              <p className="border p-2">q2</p>
              <p className="border p-2">q3</p>

              <p className="border p-2">userId</p>
              <p className="border p-2">1</p>
              <p className="border p-2">2</p>
              <p className="border p-2">3</p>
            </div>
          </AlertDescription>
        </Alert>
        {file && !isTemplateConfirmed && (
          <Button onClick={confirmTemplate}>Konfirmasi Template</Button>
        )}
        {isTemplateConfirmed && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Template Terkonfirmasi</AlertTitle>
            <AlertDescription>
              File Kamu sesuai dengan template yang diharapkan.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleUpload}
          disabled={!isTemplateConfirmed}
        >
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}
