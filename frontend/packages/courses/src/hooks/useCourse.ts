import { fetchCourse } from '@alum-net/courses/src/service';
import { useUserInfo } from '@alum-net/users';
import { QUERY_KEYS } from '@alum-net/api';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { Toast } from '@alum-net/ui';
import { useEffect } from 'react';

export const useCourse = (id: string) => {
  const { data: userInfo } = useUserInfo();
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.getCourse, id],
    queryFn: () => fetchCourse(id, userInfo?.email || ''),
    enabled: !!userInfo?.email,
  });
  const nav = useNavigation();

  useEffect(() => {
    if (data?.errors && data?.errors.length > 0) {
      Toast.error(data.errors[0]);
      if (nav.canGoBack()) nav.goBack();
      else
        nav.reset({
          index: 0,
          routes: [{ name: 'courses' as never }],
        });
    }
  }, [data?.errors, nav]);

  return {
    data,
    isLoading,
  };
};
