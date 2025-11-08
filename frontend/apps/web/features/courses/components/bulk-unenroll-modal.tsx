import React from 'react';
import BulkEnrollModal from './bulk-enroll-modal';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  courseId: string | number;
};

export default function BulkUnenrollModal(props: Props) {
  return <BulkEnrollModal {...props} mode="unenroll" />;
}
