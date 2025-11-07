import { z } from 'zod';
import { MESSAGING_CONSTANTS } from '@alum-net/messaging';

export const messageContentSchema = z
  .string()
  .trim()
  .min(MESSAGING_CONSTANTS.MIN_MESSAGE_LENGTH, 'El mensaje no puede estar vacío')
  .max(
    MESSAGING_CONSTANTS.MAX_MESSAGE_LENGTH,
    `El mensaje no puede superar los ${MESSAGING_CONSTANTS.MAX_MESSAGE_LENGTH} caracteres`
  );

export type MessageContent = z.infer<typeof messageContentSchema>;

