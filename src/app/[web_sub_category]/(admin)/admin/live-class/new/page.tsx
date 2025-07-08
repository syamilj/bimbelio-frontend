import { Metadata } from 'next';
import { CreateLiveClassForm } from '../_components/create-live-class-form';

export const metadata: Metadata = {
  title: 'Buat Live Class Baru - Admin Dashboard',
  description: 'Buat live class baru dengan tutor dan jadwal',
};

export default function CreateLiveClassPage() {
  return <CreateLiveClassForm />;
}
