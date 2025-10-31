import { z } from 'zod';

export const taskSchema = z
  .object({
    sectionId: z.number().int().positive('Debe seleccionar una sección'),
    title: z.string().trim().min(3, 'Mínimo 3 caracteres').max(120, 'Máximo 120'),
    description: z.string().trim().max(2000, 'Máximo 2000').optional().or(z.literal('')),
    startDate: z.string().min(1, 'Fecha de inicio requerida'),
    endDate: z.string().min(1, 'Fecha de fin requerida'),
    maxGrade: z.number().int().min(0, 'Mínimo 0').max(100, 'Máximo 100'),
  })
  .refine(
    (data) => new Date(data.startDate) < new Date(data.endDate), 
    {
      message: 'La fecha de inicio debe ser anterior a la fecha de fin',
      path: ['endDate'],
    }
  );

export type TaskFormData = z.infer<typeof taskSchema>;