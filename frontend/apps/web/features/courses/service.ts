import api, { Response } from '@alum-net/api';
import { BulkCreationResponse } from './types';

export const deleteCourse = async (courseId: string, sectionId: number) => {
  return await api.delete(`/sections/${courseId}/${sectionId}`);
};

export async function bulkCreateCourses(file: File, hasHeaders = true) {
  const form = new FormData();
  form.append('file', file);

  return api.post<BulkCreationResponse>(
    `/courses/bulk-creation?hasHeaders=${hasHeaders}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
}

type BulkEnrollResponse = {
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: { lineNumber: number; identifier: string; reason: string }[];
};

export async function bulkEnrollStudents(
  courseId: string | number,
  file: File,
  hasHeaders = false,
) {
  const form = new FormData();
  form.append('file', file);

  return api.post<Response<BulkEnrollResponse>>(
    `/courses/${courseId}/participations/bulk-enroll?hasHeaders=${hasHeaders}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
}

export async function bulkUnenrollStudents(
  courseId: string | number,
  file: File,
  hasHeaders = false,
) {
  const form = new FormData();
  form.append('file', file);

  // backend expects a DELETE with multipart/form-data; axios needs request with method 'delete' and data
  return api.request<Response<BulkEnrollResponse>>({
    url: `/courses/${courseId}/participations/bulk-unenroll?hasHeaders=${hasHeaders}`,
    method: 'delete',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function bulkDeleteCourses(file: File, hasHeaders = false) {
  const form = new FormData();
  form.append('file', file);

  return api.request<Response<any>>({
    url: `/courses/bulk-deletion?hasHeaders=${hasHeaders}`,
    method: 'delete',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
