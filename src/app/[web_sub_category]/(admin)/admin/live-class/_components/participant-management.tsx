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
import {
  getParticipantEmails,
  getParticipantsByLiveClass,
  getParticipantStats,
  LiveClassParticipant,
  mockLiveClasses,
  mockLiveClassParticipants,
} from '@/lib/mock-data/live-class';
import {
  CheckCircle,
  Clock,
  Copy,
  Mail,
  Search,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface ParticipantManagementProps {
  liveClassId: string;
}

export function ParticipantManagement({
  liveClassId,
}: ParticipantManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Get live class info
  const liveClass = mockLiveClasses.find((lc) => lc.id === liveClassId);
  const participants = getParticipantsByLiveClass(liveClassId);
  const stats = getParticipantStats(liveClassId);

  // Filter participants based on search
  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedParticipants(filteredParticipants.map((p) => p.id));
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleSelectParticipant = (participantId: string, checked: boolean) => {
    if (checked) {
      setSelectedParticipants((prev) => [...prev, participantId]);
    } else {
      setSelectedParticipants((prev) =>
        prev.filter((id) => id !== participantId),
      );
    }
  };

  const handleBulkInvite = async () => {
    if (selectedParticipants.length === 0) {
      toaster({
        title: 'Tidak ada peserta yang dipilih',
        description: 'Pilih minimal satu peserta untuk diundang',
        condition: 'warning',
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update mock data status
      selectedParticipants.forEach((participantId) => {
        const participant = mockLiveClassParticipants.find(
          (p) => p.id === participantId,
        );
        if (participant && participant.status === 'registered') {
          participant.status = 'invited';
          participant.invitedAt = new Date();
        }
      });

      toaster({
        title: 'Undangan Berhasil Dikirim!',
        description: `${selectedParticipants.length} peserta berhasil diundang`,
        condition: 'success',
      });

      setSelectedParticipants([]);
    } catch (error) {
      toaster({
        title: 'Gagal Mengirim Undangan',
        description: 'Terjadi kesalahan saat mengirim undangan',
        condition: 'warning',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyEmails = (status?: 'registered' | 'invited') => {
    const emails = getParticipantEmails(liveClassId, status);
    navigator.clipboard.writeText(emails.join(', '));

    toaster({
      title: 'Email Berhasil Disalin!',
      description: `${emails.length} email berhasil disalin ke clipboard`,
      condition: 'success',
    });
  };

  const getStatusBadge = (status: LiveClassParticipant['status']) => {
    switch (status) {
      case 'registered':
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="h-3 w-3 mr-1" />
            Terdaftar
          </Badge>
        );
      case 'invited':
        return (
          <Badge
            variant="outline"
            className="text-green-600 border-green-600"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Diundang
          </Badge>
        );
      case 'expired':
        return (
          <Badge
            variant="outline"
            className="text-red-600 border-red-600"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Kadaluarsa
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!liveClass) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Live class tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Manajemen Peserta</h2>
        <p className="text-gray-600">{liveClass.title}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      </div>

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
            disabled={stats.registered === 0}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Email Terdaftar
          </Button>

          <Button
            variant="outline"
            onClick={() => handleCopyEmails('invited')}
            disabled={stats.invited === 0}
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
                <TableHead>Terdaftar</TableHead>
                <TableHead>Diundang</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedParticipants.includes(participant.id)}
                      onCheckedChange={(checked) =>
                        handleSelectParticipant(participant.id, !!checked)
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
                      {participant.packageType}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(participant.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDate(participant.registeredAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {participant.invitedAt
                        ? formatDate(participant.invitedAt)
                        : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {participant.status === 'registered' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSelectParticipant(participant.id, true)
                        }
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        Undang
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredParticipants.length === 0 && (
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
