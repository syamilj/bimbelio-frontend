'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toaster } from '@/components/ui/toaster';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { responseError } from '@/lib/response';
import { formatDate } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  Copy,
  Loader2,
  Mail,
  Search,
  UserCheck,
  Users,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

type PaticipantType = {
  id: string;
  email: string;
  name: string;
  subs: string;
  image: string | null;
  inviteStatus: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    liveClassId: string;
    userId: string;
  } | null;
};

export default function ParticipantsPage() {
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  console.log({ classId });

  const {
    data: Participants,
    isLoading: ParticipantsIsLoading,
    refetch: ParticipantsRefetch,
  } = useGet<PaticipantType[]>('/liveClass/getLiveClassParticipants', {
    params: { id: classId },
  });

  console.log({ Participants });

  const participants = Participants || [];

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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter participants based on search
  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedParticipants(filteredParticipants.map((p) => p.email));
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleSelectParticipant = (email: string, checked: boolean) => {
    if (checked) {
      setSelectedParticipants((prev) => [...prev, email]);
    } else {
      setSelectedParticipants((prev) =>
        prev.filter((pEmail) => pEmail !== email),
      );
    }
  };

  const [isLoadingInviteUser, setIsLoadingInviteUser] = useState<string | null>(
    null,
  );

  const { mutate: InviteUser, isLoading: InviteUserIsLoading } = useMutation(
    '/liveClass/addLiveClassInvited',
    'post',
    {
      async onSuccess() {
        await ParticipantsRefetch();
        setIsLoadingInviteUser(null);
      },
    },
  );

  const { mutate: InviteManyUser } = useMutation(
    '/liveClass/addManyLiveClassInvited',
    'post',
  );

  const handleBulkInvite = async () => {
    if (selectedParticipants.length === 0) {
      toaster({
        title: 'Tidak ada peserta yang dipilih',
        description: 'Pilih minimal satu peserta untuk diundang',
        condition: 'warning',
      });
      return;
    }
    console.log({ selectedParticipants });
    // return;
    setIsUpdating(true);
    try {
      await InviteManyUser({
        payload: {
          liveClassId: classId,
          emails: selectedParticipants,
        },
      });
      await ParticipantsRefetch();
      setSelectedParticipants([]);
    } catch (error) {
      responseError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyEmails = (status?: 'registered' | 'invited') => {
    let emails: string[] = [];
    if (status === 'registered') {
      emails = filteredParticipants
        .filter((item) => !item.inviteStatus)
        .map((item) => item.email);
    }
    if (status === 'invited') {
      emails = filteredParticipants
        .filter((item) => !!item.inviteStatus)
        .map((item) => item.email);
    }
    navigator.clipboard.writeText(emails.join(', '));

    toaster({
      title: 'Email Berhasil Disalin!',
      description: `${emails.length} email berhasil disalin ke clipboard`,
      condition: 'success',
    });
  };

  const getStatusBadge = (status: boolean) => {
    switch (status) {
      case false:
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="h-3 w-3 mr-1" />
            Terdaftar
          </Badge>
        );
      case true:
        return (
          <Badge
            variant="outline"
            className="text-green-600 border-green-600"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Diundang
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div>
        <h2 className="text-2xl font-bold">Manajemen Peserta</h2>
        <p className="text-gray-600">{liveClass.title}</p>
      </div> */}

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Peserta</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Terdaftar</p>
                <p className="text-2xl font-bold">{stats.registered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Diundang</p>
                <p className="text-2xl font-bold">{stats.invited}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kadaluarsa</p>
                <p className="text-2xl font-bold">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari peserta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleCopyEmails('registered')}
            // disabled={stats.registered === 0}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Email Terdaftar
          </Button>

          <Button
            variant="outline"
            onClick={() => handleCopyEmails('invited')}
            // disabled={stats.invited === 0}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Email Diundang
          </Button>

          <Button
            onClick={handleBulkInvite}
            disabled={selectedParticipants.length === 0 || isUpdating}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Mengirim...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Undang Peserta ({selectedParticipants.length})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Peserta</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedParticipants.length ===
                        filteredParticipants.length &&
                      filteredParticipants.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Peserta</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Diundang</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ParticipantsIsLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="w-full flex justify-center items-center pt-[1rem]">
                      <Loader2 className="animate-spin w-10 h-10 text-main" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredParticipants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedParticipants.includes(
                          participant.email,
                        )}
                        onCheckedChange={(checked) =>
                          handleSelectParticipant(participant.email, !!checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/api/placeholder/32/32`} />
                          <AvatarFallback>
                            {participant.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{participant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {participant.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {participant.subs}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(!!participant.inviteStatus)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {participant.inviteStatus
                          ? formatDate(participant.inviteStatus.createdAt)
                          : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {!participant.inviteStatus && (
                        <Button
                          className="flex items-center justify-center"
                          variant="outline"
                          size="sm"
                          disabled={isLoadingInviteUser === participant.id}
                          onClick={() => {
                            // handleSelectParticipant(participant.id, true);
                            setIsLoadingInviteUser(participant.id);
                            InviteUser({
                              payload: {
                                liveClassId: classId,
                                userId: participant.id,
                              },
                            });
                          }}
                        >
                          {!(isLoadingInviteUser === participant.id) ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Undang
                            </>
                          ) : (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {!ParticipantsIsLoading && filteredParticipants.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery
                  ? 'Tidak ada peserta yang ditemukan'
                  : 'Belum ada peserta yang mendaftar'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
