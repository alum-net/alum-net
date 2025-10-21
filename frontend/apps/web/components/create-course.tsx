import React from 'react';
import { View, ScrollView, StyleSheet, Modal } from 'react-native';
import { Button, Text, SegmentedButtons } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput, THEME } from '@alum-net/ui';
import { CourseCreationPayload, CourseShift } from '@alum-net/courses';
import { createCourse } from '@alum-net/courses/src/service';
import {
  courseCreationSchema,
  CourseFormData,
} from '@/validations/course-creation';

type CreateCourseModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

export default function CreateCourseModal({
  visible,
  onDismiss,
}: CreateCourseModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseCreationSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      shift: CourseShift.MORNING,
      approvalGrade: '',
      teachersEmails: '',
    },
  });

  const handleFormSubmit = async (data: CourseFormData) => {
    const courseData: CourseCreationPayload = {
      name: data.name,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      shift: data.shift as CourseShift,
      approvalGrade: parseFloat(data.approvalGrade),
      teachersEmails: data.teachersEmails.split(',').map(e => e.trim()),
    };

    await createCourse(courseData);
    reset();
    onDismiss();
  };

  const handleCancel = () => {
    reset();
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleCancel}
      backdropColor={THEME.colors.backdrop}
      animationType="fade"
    >
      <ScrollView style={styles.modal}>
        <Text variant="headlineMedium" style={styles.title}>
          Crear curso
        </Text>

        <FormTextInput
          name="name"
          control={control}
          label="Nombre"
          mode="outlined"
          style={styles.input}
          error={!!errors.name}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <FormTextInput
          name="description"
          control={control}
          label="Descripción"
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          error={!!errors.description}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}

        <FormTextInput
          name="startDate"
          control={control}
          label="Fecha de comienzo (YYYY-MM-DD)"
          mode="outlined"
          placeholder="2025-01-15"
          style={styles.input}
          error={!!errors.startDate}
        />
        {errors.startDate && (
          <Text style={styles.errorText}>{errors.startDate.message}</Text>
        )}

        <FormTextInput
          name="endDate"
          control={control}
          label="Fecha de fin (YYYY-MM-DD)"
          mode="outlined"
          placeholder="2025-05-15"
          style={styles.input}
          error={!!errors.endDate}
        />
        {errors.endDate && (
          <Text style={styles.errorText}>{errors.endDate.message}</Text>
        )}

        <Text variant="labelLarge" style={styles.label}>
          Turno
        </Text>
        <Controller
          name="shift"
          control={control}
          render={({ field }) => (
            <SegmentedButtons
              value={field.value}
              onValueChange={field.onChange}
              buttons={[
                { value: 'MORNING', label: 'Mañana' },
                { value: 'AFTERNOON', label: 'Tarde' },
                { value: 'NIGHT', label: 'Noche' },
              ]}
              style={styles.input}
            />
          )}
        />

        <FormTextInput
          name="approvalGrade"
          control={control}
          label="Nota de aprobación (0-1)"
          mode="outlined"
          keyboardType="numeric"
          placeholder="0.7"
          style={styles.input}
          error={!!errors.approvalGrade}
        />
        {errors.approvalGrade && (
          <Text style={styles.errorText}>{errors.approvalGrade.message}</Text>
        )}

        <FormTextInput
          name="teachersEmails"
          control={control}
          label="Emails de los profesores (separados por coma)"
          mode="outlined"
          placeholder="teacher1@example.com, teacher2@example.com"
          keyboardType="email-address"
          multiline
          autoCapitalize="none"
          style={styles.input}
          error={!!errors.teachersEmails}
        />
        {errors.teachersEmails && (
          <Text style={styles.errorText}>{errors.teachersEmails.message}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleCancel} style={styles.button}>
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(handleFormSubmit)}
            style={styles.button}
          >
            Crear curso
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    flex: 1,
    width: '60%',
    alignSelf: 'center',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
  },
  errorText: {
    color: THEME.colors.error,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
