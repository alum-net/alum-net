export type SectionOption = {
  id: number;
  title: string;
  description?: string;
};

export type TaskCreateRequest = {
  sectionId: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxGrade: number;
};

export type OnsiteCreateRequest = {
  sectionId: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxGrade: number;
};

export type QuestionnaireCreateRequest = {
  sectionId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxGrade: number;
  durationInMinutes: number;
  questions: QuestionWithAnswers[];
};

export type QuestionWithAnswers = {
  text: string;
  answers: Answer[];
};

export type Answer = {
  text: string;
  correct: boolean;
};

export enum EventType {
  TASK = 'TASK',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  ONSITE = 'ONSITE',
}
