import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput, THEME } from '@alum-net/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { UserRole } from '@alum-net/users/src/types';
import {
  UserCreationFormData,
  userCreationSchema,
} from '../validations/user-creation';
import { createUser, CreateUserForm, getAxiosErrorMessage } from '../service';

type Props = { visible: boolean; onDismiss: () => void };

export default function CreateUserModal({ visible, onDismiss }: Props) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  // Banner interno solo para error
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserCreationFormData>({
    resolver: zodResolver(userCreationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: UserRole.student,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: CreateUserForm) => createUser(data),
  });

  const onSubmit = useCallback(
    async (data: UserCreationFormData) => {
      try {
        setSubmitting(true);
        setServerMessage(null);

        const payload: CreateUserForm = {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
          password: data.password,
          role: data.role as UserRole,
        };

        const res = await mutateAsync(payload);

        if (res?.success) {
          // cerrar modal e invalidar lista
          reset();
          onDismiss();
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.getUsers],
          });
        } else {
          // Error (success:false) -> mostrar mensaje del back y no cerrar
          const msg =
            res?.message || res?.errors?.[0] || 'No se pudo crear el usuario';
          setServerMessage(String(msg));
        }
      } catch (e) {
        // Error HTTP/excepción -> mostrar mensaje y no cerrar
        setServerMessage(getAxiosErrorMessage(e));
      } finally {
        setSubmitting(false);
      }
    },
    [mutateAsync, onDismiss, queryClient, reset],
  );

  const handleCancel = () => {
    reset();
    setServerMessage(null);
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
          Crear usuario
        </Text>

        <FormTextInput
          name="firstName"
          control={control}
          label="Nombre"
          mode="outlined"
          style={styles.input}
          error={!!errors.firstName}
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName.message}</Text>
        )}

        <FormTextInput
          name="lastName"
          control={control}
          label="Apellido"
          mode="outlined"
          style={styles.input}
          error={!!errors.lastName}
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName.message}</Text>
        )}

        <FormTextInput
          name="email"
          control={control}
          label="Email"
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          error={!!errors.email}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <FormTextInput
          name="password"
          control={control}
          label="Contraseña"
          mode="outlined"
          secureTextEntry
          style={styles.input}
          error={!!errors.password}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <Text variant="labelLarge" style={styles.label}>
          Rol
        </Text>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <SegmentedButtons
              value={field.value}
              onValueChange={val => field.onChange(val as UserRole)}
              buttons={[
                { value: UserRole.student, label: 'Estudiante' },
                { value: UserRole.teacher, label: 'Profesor' },
                { value: UserRole.admin, label: 'Admin' },
              ]}
              style={styles.input}
            />
          )}
        />

        {serverMessage && (
          <View style={[styles.banner, styles.bannerError]}>
            <Text style={styles.bannerText}>{serverMessage}</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <Button mode="outlined" onPress={handleCancel} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            disabled={submitting}
          >
            Crear usuario
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
  title: { marginBottom: 20, fontWeight: 'bold' },
  input: { marginBottom: 8 },
  label: { marginBottom: 8, marginTop: 8 },

  errorText: {
    color: THEME.colors.error,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },

  banner: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  bannerError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  bannerText: {
    fontSize: 14,
    color: '#111827',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
});
