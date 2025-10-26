import { z } from 'zod';

export const schema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z
    .string()
    .max(500, 'La descripción no puede superar los 500 caracteres.')
    .optional(),
  resourcesMetadata: z.array(
    z.object({ filename: z.string(), order: z.number() }).optional(),
  ),
});

export type SectionCreationFormSchema = z.infer<typeof schema>;
