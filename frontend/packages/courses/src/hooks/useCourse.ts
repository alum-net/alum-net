import { getCourse } from '@alum-net/courses/src/service';
import { useUserInfo } from '@alum-net/users';
import { QUERY_KEYS } from '@alum-net/api';
import { useQuery } from '@tanstack/react-query';
import { Toast } from '@alum-net/ui';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { Response } from '@alum-net/api';
import { useNavigation } from '@react-navigation/native';

export const useCourse = (id: string) => {
  const { data: userInfo } = useUserInfo();
  const nav = useNavigation();
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.getCourse, id, userInfo?.email],
    queryFn: () => getCourse(id, userInfo?.email || ''),
    enabled: !!userInfo?.email,
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 0,
  });

  useEffect(() => {
    if (data?.errors && data?.errors.length > 0) {
      Toast.error(data.errors[0]);
      if (nav.canGoBack()) nav.goBack();
      else
        nav.reset({
          index: 0,
          routes: [{ name: 'courses' as never }],
        });
      return;
    }

    if (error) {
      const axiosError = error as AxiosError<Response>;
      const errorMessage =
        axiosError?.response?.data?.errors?.[0] ||
        axiosError?.response?.data?.message ||
        'A ocurrido un error inesperado, intentalo mas tarde';
      Toast.error(errorMessage);
      if (nav.canGoBack()) nav.goBack();
      else
        nav.reset({
          index: 0,
          routes: [{ name: 'courses' as never }],
        });
    }
  }, [data?.errors, error, nav]);

  return {
    data,
    isLoading,
  };
};
