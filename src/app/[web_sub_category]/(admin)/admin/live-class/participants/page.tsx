import { ParticipantManagement } from '../_components/participant-management';

interface ParticipantsPageProps {
  searchParams: {
    classId?: string;
  };
}

export default function ParticipantsPage({
  searchParams,
}: ParticipantsPageProps) {
  const { classId } = searchParams;

  if (!classId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ID Live Class Tidak Ditemukan
          </h3>
          <p className="text-gray-500">
            Silakan pilih live class untuk melihat peserta
          </p>
        </div>
      </div>
    );
  }

  return <ParticipantManagement liveClassId={classId} />;
}
