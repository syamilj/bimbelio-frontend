'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTutors } from '@/lib/mock-data/live-class';
import { Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { TutorFilters } from './tutor-filters';
import { TutorMetrics } from './tutor-metrics';
import { TutorTable } from './tutor-table';

export function TutorDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter tutors based on search and filters
  const filteredTutors = mockTutors.filter((tutor) => {
    const matchesSearch =
      tutor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesSubject =
      !subjectFilter ||
      subjectFilter === 'all' ||
      tutor.subjects.includes(subjectFilter);
    const matchesStatus =
      !statusFilter ||
      statusFilter === 'all' ||
      (statusFilter === 'active' && tutor.isActive) ||
      (statusFilter === 'inactive' && !tutor.isActive);

    return matchesSearch && matchesSubject && matchesStatus;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSubjectFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Tutor</h1>
          <p className="text-gray-600">
            Manage tutors for live classes and their performance
          </p>
        </div>
        <Button asChild>
          <Link href="tutors/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Tutor Baru
          </Link>
        </Button>
      </div>

      {/* Metrics */}
      <TutorMetrics tutors={filteredTutors} />

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pencarian & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TutorFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            subjectFilter={subjectFilter}
            setSubjectFilter={setSubjectFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Tutors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Daftar Tutor ({filteredTutors.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TutorTable tutors={filteredTutors} />
        </CardContent>
      </Card>
    </div>
  );
}
