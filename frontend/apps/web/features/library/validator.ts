import { z } from 'zod';
import { MAX_FILE_SIZE } from '../courses/constants';

export const baseSchema = z.object({
  creatorEmail: z.string().email().optional(),
  title: z.string().min(1, 'Título requerido'),
  labelIds: z.array(z.number()).optional(),
});

const fileSchema = z.object({
  uri: z.string(),
  name: z.string(),
  type: z.string().optional(),
  size: z
    .number()
    .optional()
    .refine(
      value =>
        value === undefined ||
        (value && value < MAX_FILE_SIZE * Math.pow(1024, 2)),
      'El peso del archivo es mayor a 10MB',
    ),
});

export const createSchema = baseSchema.extend({
  file: fileSchema.refine(f => !!f, 'Debes seleccionar un archivo'),
});

export const updateSchema = baseSchema;

export type FormValues = z.infer<typeof baseSchema> & {
  file?: z.infer<typeof fileSchema>;
};
