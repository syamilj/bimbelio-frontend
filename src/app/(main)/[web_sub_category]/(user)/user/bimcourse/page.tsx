import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import BimCoursePage from './_components/bimcourse-page';

export const metadata: Metadata = {
  ...METADATA_USER.course,
};

export default function Course() {
  return <BimCoursePage />;
}
