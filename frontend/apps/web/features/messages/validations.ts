import { z } from 'zod';
import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from '@alum-net/messaging';

export const messageContentSchema = z
  .string()
  .trim()
  .min(MIN_MESSAGE_LENGTH, 'El mensaje no puede estar vacío')
  .max(
    MAX_MESSAGE_LENGTH,
    `El mensaje no puede superar los ${MAX_MESSAGE_LENGTH} caracteres`,
  );

export type MessageContent = z.infer<typeof messageContentSchema>;
