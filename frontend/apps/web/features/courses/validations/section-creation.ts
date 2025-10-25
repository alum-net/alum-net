import { z } from 'zod';

export const schema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  content: z.string().optional(),
  links: z
    .array(z.url('Debe ser un enlace válido').optional().or(z.literal('')))
    .optional(),
  fileUrls: z.array(z.string().optional().optional()),
});

export type SectionCreationFormSchema = z.infer<typeof schema>;
