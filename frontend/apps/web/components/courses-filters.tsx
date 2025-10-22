import { FilterBar } from '@alum-net/courses';
import { THEME } from '@alum-net/ui';
import { useUserInfo } from '@alum-net/users';
import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import CreateCourseModal from './create-course';

function CourseFilters({ currentPage }: { currentPage: number }) {
  const { userInfo } = useUserInfo();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View>
      <FilterBar currentPage={currentPage} />
      {userInfo?.role === 'admin' && (
        <>
          <Button
            mode="contained"
            style={styles.createButton}
            labelStyle={styles.createButtonLabel}
            icon="plus"
            onPress={() => setIsModalVisible(true)}
          >
            Crear nuevo curso
          </Button>
          <CreateCourseModal
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
          />
        </>
      )}
    </View>
  );
}

export default memo(CourseFilters);

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: THEME.colors.primary,
    alignSelf: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  createButtonLabel: {
    color: 'white',
    fontSize: 12,
  },
});
