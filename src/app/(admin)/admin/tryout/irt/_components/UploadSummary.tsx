import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UploadSummary({
  participantFile,
  threePLFile,
}: {
  participantFile: File | null;
  threePLFile: File | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringkasan Upload</CardTitle>
        <CardDescription>Ringkasan file yang telah diunggah</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Data Peserta:</h3>
          {participantFile ? (
            <p>
              {participantFile.name} ({(participantFile.size / 1024).toFixed(2)}{' '}
              KB)
            </p>
          ) : (
            <p>Belum diunggah</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold">Data 3PL:</h3>
          {threePLFile ? (
            <p>
              {threePLFile.name} ({(threePLFile.size / 1024).toFixed(2)} KB)
            </p>
          ) : (
            <p>Belum diunggah</p>
          )}
        </div>
        {/* <Button onClick={onNext} disabled={!participantFile || !threePLFile}>
          Lanjut ke Pemrosesan Data
        </Button> */}
      </CardContent>
    </Card>
  );
}
