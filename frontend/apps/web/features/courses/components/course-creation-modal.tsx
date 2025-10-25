import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Modal } from 'react-native';
import { Button, Text, SegmentedButtons, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput, THEME, Toast } from '@alum-net/ui';
import {
  CourseCreationPayload,
  CourseShift,
  useCoursesContext,
} from '@alum-net/courses';
import { createCourse } from '@alum-net/courses/src/service';
import {
  courseCreationSchema,
  CourseFormData,
} from '../validations/course-creation';
import FormDateInput from '../../../components/date-input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { isValidDecimal } from '@alum-net/courses/src/helpers';
import { z } from 'zod';

type CreateCourseModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

export default function CreateCourseModal({
  visible,
  onDismiss,
}: CreateCourseModalProps) {
  const { appliedFilters, currentPage } = useCoursesContext();
  const [teacherEmailInput, setTeacherEmailInput] = useState('');
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (data: CourseCreationPayload) => {
      await createCourse(data);
      reset();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getCourses, appliedFilters, currentPage],
      });

      Toast.success('Curso creado correctamente!');
      onDismiss();
    },
    onError: () => {
      Toast.error('Hubo un error en la creación del curso');
    },
  });

  const onSubmit = useCallback(
    (data: CourseFormData) => {
      const courseData: CourseCreationPayload = {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        shift: data.shift,
        approvalGrade: parseFloat(data.approvalGrade),
        teachersEmails: data.teachersEmails,
      };
      mutate(courseData);
    },
    [mutate],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseCreationSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      shift: CourseShift.morning,
      approvalGrade: '',
      teachersEmails: [],
    },
  });

  const addTeacherEmail = () => {
    const email = teacherEmailInput.trim();
    if (email) {
      try {
        z.string().email().parse(email); // validate email
        const current = getValues('teachersEmails') || [];
        setValue('teachersEmails', [...current, email]);
        setTeacherEmailInput('');
      } catch {
        Toast.error('Email inválido');
      }
    }
  };

  const removeTeacherEmail = (index: number) => {
    const current = getValues('teachersEmails') || [];
    setValue(
      'teachersEmails',
      current.filter((_, i) => i !== index),
    );
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
        <FormDateInput
          name="startDate"
          control={control}
          label="Fecha de comienzo"
          placeholder="2025-01-15"
          style={styles.input}
          error={!!errors.startDate}
        />
        {errors.startDate && (
          <Text style={styles.errorText}>{errors.startDate.message}</Text>
        )}

        <FormDateInput
          name="endDate"
          control={control}
          label="Fecha de fin"
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
            <>
              <SegmentedButtons
                value={field.value}
                onValueChange={field.onChange}
                buttons={[
                  { value: 'MORNING', label: 'Mañana' },
                  { value: 'AFTERNOON', label: 'Tarde' },
                  { value: 'EVENING', label: 'Noche' },
                ]}
                style={styles.input}
              />
              {errors.shift && (
                <Text style={styles.errorText}>{errors.shift.message}</Text>
              )}
            </>
          )}
        />

        <FormTextInput
          name="approvalGrade"
          control={control}
          label="Nota de aprobación (0-1)"
          mode="outlined"
          keyboardType="numeric"
          customOnChange={(value, fieldOnChange) => {
            if (isValidDecimal(value)) fieldOnChange(value);
          }}
          placeholder="0.7"
          style={styles.input}
          error={!!errors.approvalGrade}
        />
        {errors.approvalGrade && (
          <Text style={styles.errorText}>{errors.approvalGrade.message}</Text>
        )}

        <Text variant="labelLarge" style={styles.label}>
          Profesores
        </Text>

        <TextInput
          label="Añadir email..."
          mode="outlined"
          value={teacherEmailInput}
          onChangeText={setTeacherEmailInput}
          right={<TextInput.Icon icon="plus" onPress={addTeacherEmail} />}
        />

        {errors.teachersEmails && (
          <Text style={styles.errorText}>{errors.teachersEmails.message}</Text>
        )}

        <View style={{ marginTop: 8 }}>
          {(watch('teachersEmails') || []).map((email, index) => (
            <View key={index}>
              <Text style={{ flex: 1 }}>{email}</Text>
              <Button compact onPress={() => removeTeacherEmail(index)}>
                Eliminar
              </Button>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleCancel} style={styles.button}>
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
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
