import { FilterBar } from '@alum-net/courses';
import { THEME } from '@alum-net/ui';
import { useUserInfo } from '@alum-net/users';
import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import CreateCourseModal from './course-creation-modal';
import BulkCourseUploadModal from './bulk-course-upload-modal';
import BulkCourseDeletionModal from './bulk-course-deletion-modal';
import { UserRole } from '@alum-net/users/src/types';

function CourseFilters() {
  const { data } = useUserInfo();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  return (
    <View>
      <FilterBar />

      {data?.role === UserRole.admin && (
        <>
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              style={styles.createButton}
              labelStyle={styles.createButtonLabel}
              icon="plus"
              onPress={() => setIsModalVisible(true)}
            >
              Crear nuevo curso
            </Button>

            <Button
              mode="contained"
              style={styles.createButton}
              labelStyle={styles.createButtonLabel}
              icon="upload"
              onPress={() => setIsBulkModalVisible(true)}
            >
              Carga masiva de cursos
            </Button>
            <Button
              mode="contained"
              style={styles.createButton}
              labelStyle={styles.createButtonLabel}
              icon="delete"
              onPress={() => setIsDeleteModalVisible(true)}
            >
              Eliminación masiva
            </Button>
          </View>

          <CreateCourseModal
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
          />

          <BulkCourseUploadModal
            visible={isBulkModalVisible}
            onDismiss={() => setIsBulkModalVisible(false)}
          />

          <BulkCourseDeletionModal
            visible={isDeleteModalVisible}
            onDismiss={() => setIsDeleteModalVisible(false)}
          />
        </>
      )}
    </View>
  );
}

export default memo(CourseFilters);

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: THEME.colors.primary,
  },
  createButtonLabel: {
    color: 'white',
    fontSize: 12,
  },
});
