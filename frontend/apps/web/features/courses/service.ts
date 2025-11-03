import api from '@alum-net/api';
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
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
}
