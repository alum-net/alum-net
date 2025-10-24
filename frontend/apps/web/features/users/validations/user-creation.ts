import { z } from 'zod';
import { UserRole } from '@alum-net/users/src/types';

export const userCreationSchema = z.object({
  firstName: z.string().min(1, 'El nombre no puede estar vacío'),
  lastName: z.string().min(1, 'El apellido no puede estar vacío'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.nativeEnum(UserRole),
});

export type UserCreationFormData = z.infer<typeof userCreationSchema>;
