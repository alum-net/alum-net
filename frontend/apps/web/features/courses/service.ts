import api from '@alum-net/api';

export const deleteCourse = async (courseId: string, sectionId: number) => {
  return await api.delete(`/sections/${courseId}/${sectionId}`);
};
