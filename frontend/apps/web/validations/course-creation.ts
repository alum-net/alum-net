import { CourseShift } from '@alum-net/courses';
import { isValidDecimal } from '@alum-net/courses/src/helpers';
import { z } from 'zod';

export const courseCreationSchema = z
  .object({
    name: z
      .string()
      .min(3, 'El nombre del curso debe tener al menos 3 caracteres'),
    description: z
      .string()
      .min(10, 'La descripción debe tener al menos 10 caracteres'),
    startDate: z.string().refine(date => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Fecha de inicio inválida'),
    endDate: z.string().refine(date => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Fecha de finalización inválida'),
    shift: z.enum(CourseShift),
    approvalGrade: z
      .string()
      .min(3, 'La nota debe estar entre 0 y 1')
      .refine(val => {
        return isValidDecimal(val);
      }, 'La nota debe estar entre 0 y 1'),
    teachersEmails: z.string().refine(val => {
      const emails = val
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0);
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emails.length > 0 && emails.every(email => emailRegex.test(email));
    }, 'Ingrese correos válidos separados por comas (ej: email1@example.com, email2@example.com)'),
  })
  .refine(
    data => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message:
        'La fecha de finalización debe ser posterior a la fecha de inicio',
      path: ['endDate'],
    },
  );

export type CourseFormData = z.infer<typeof courseCreationSchema>;
