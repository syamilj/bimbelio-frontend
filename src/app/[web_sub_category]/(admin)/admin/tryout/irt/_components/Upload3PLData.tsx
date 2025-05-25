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

export default function Upload3PLData({
  setThreePLFile,
}: {
  setThreePLFile: (file: File | null) => void;
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
        data.forEach((item) => {
          const keys = Object.keys(item);
          if (!item.question) {
            error = {
              value: true,
              message: 'Tidak Valid!!',
            };
          }
          if (!item.a) {
            error = {
              value: true,
              message: 'Tidak Valid!!',
            };
          }

          if (!item.b) {
            error = {
              value: true,
              message: 'Tidak Valid!!',
            };
          }

          if (!item.c) {
            error = {
              value: true,
              message: 'Tidak Valid!!',
            };
          }
        });
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
    setThreePLFile(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Data 3PL</CardTitle>
        <CardDescription>
          Unggah file CSV yang berisi parameter item 3PL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="3pl-data">Data 3PL (CSV)</Label>
          <Input
            id="3pl-data"
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
              <p className="border p-2">question</p>
              <p className="border p-2">a</p>
              <p className="border p-2">b</p>
              <p className="border p-2">c</p>

              <p className="border p-2">float</p>
              <p className="border p-2">float</p>
              <p className="border p-2">float</p>
              <p className="border p-2">float</p>
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
