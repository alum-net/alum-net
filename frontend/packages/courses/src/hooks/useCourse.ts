import { getCourse } from '@alum-net/courses/src/service';
import { useUserInfo } from '@alum-net/users';
import { QUERY_KEYS } from '@alum-net/api';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { Toast } from '@alum-net/ui';
import { useEffect } from 'react';

export const useCourse = (id: string) => {
  const { data: userInfo } = useUserInfo();
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.getCourse],
    queryFn: () => getCourse(id, userInfo?.email || ''),
    enabled: !!userInfo?.email,
  });
  const nav = useNavigation();

  useEffect(() => {
    if (error || (data?.errors && data?.errors.length > 0)) {
      Toast.error(
        data?.errors?.[0] ||
          'A ocurrido un error inesperado, intentalo mas tarde',
      );
      if (nav.canGoBack()) nav.goBack();
      else
        nav.reset({
          index: 0,
          routes: [{ name: 'courses' as never }],
        });
    }
  }, [data?.errors, nav, error]);

  return {
    data,
    isLoading,
  };
};
