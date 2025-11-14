import api from '@alum-net/api';
import type { AxiosError } from 'axios';
import type { EventFormData } from './components/event-creation-modal';

export async function createEvent(courseId: string, eventData: EventFormData) {
  try {
    const { data } = await api.post('/events/create', {
      ...eventData,
      courseId,
      type: eventData.type.toUpperCase(),
    });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;

    const backendErrors = axiosError.response?.data?.errors;
    const firstError =
      Array.isArray(backendErrors) && backendErrors.length > 0
        ? backendErrors[0]
        : null;

    const errorMessage =
      firstError ??
      axiosError.response?.data?.message ??
      axiosError.message ??
      'Error al crear el evento. Por favor, intente nuevamente.';

    throw new Error(errorMessage);
  }
}
