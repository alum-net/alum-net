import { GradeSubmission } from './types';

export const validateGrade = (grade: number | string | null): boolean => {
  if (grade === null || grade === undefined || grade === '') return false;
  const numericGrade = Number(grade);
  return !isNaN(numericGrade) && numericGrade >= 0 && numericGrade <= 100;
};

export const validateAllGrades = (grades: GradeSubmission[]): boolean => {
  return grades.every(student => validateGrade(student.grade));
};
