import { z } from 'zod';
import { MAX_FILE_SIZE } from '../courses/constants';

export const schema = z.object({
  creatorEmail: z.email('Email inválido'),
  title: z.string().min(1, 'Título requerido'),
  labelIds: z.array(z.number()).min(1, 'Selecciona al menos una etiqueta'),
  file: z
    .object({
      uri: z.string(),
      name: z.string(),
      type: z.string().optional(),
      size: z
        .number()
        .optional()
        .refine(
          value => value && value < MAX_FILE_SIZE * Math.pow(1024, 2),
          'El peso del archivo es mayor a 10MB',
        ),
    })
    .refine(f => !!f, 'Debes seleccionar un archivo'),
});

export type FormValues = z.infer<typeof schema>;
