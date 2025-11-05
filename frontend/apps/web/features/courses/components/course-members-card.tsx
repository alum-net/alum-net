import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Card,
  DataTable,
  Dialog,
  Portal,
  Text,
  IconButton,
} from 'react-native-paper';
import { useUserInfo } from '@alum-net/users';
import { UserRole, type UserInfo } from '@alum-net/users/src/types';
import { THEME, FormTextInput, Toast } from '@alum-net/ui';
import { useCourseMembers } from '@alum-net/courses/src/hooks/useCourseMembers';
import { enrollStudent, unenrollStudent } from '@alum-net/courses/src/service';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { getAxiosErrorMessage } from '../../../features/users/src/users';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

type Props = {
  courseId: string;
  totalEnrollments?: number | null;
};

export default function CourseMembersCard({
  courseId,
  totalEnrollments,
}: Props) {
  const { data: user } = useUserInfo();
  const canManage = user?.role === UserRole.teacher;

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(prev => !prev);

  const { data, isLoading, isFetching, error } = useCourseMembers(
    courseId,
    page,
    size,
  );
  if (error) console.error('[members] COMPONENT ERROR =>', error);

  const rows: UserInfo[] = data?.data ?? [];
  const total = data?.totalElements ?? 0;

  // modal matricular
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const enrollBtnRef = useRef<any>(null);
  const focusTrigger = () =>
    setTimeout(() => enrollBtnRef.current?.focus?.(), 0);

  const queryClient = useQueryClient();

  const onEnroll = async ({ email }: { email: string }) => {
    try {
      const res = await enrollStudent(courseId, email.trim());
      if (res.success) {
        Toast.success(res.message || 'Estudiante matriculado correctamente');
        setOpen(false);
        reset({ email: '' });
        focusTrigger();
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getCourse] }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.getCourseMembers, courseId],
          }),
        ]);
      } else {
        Toast.error(res.errors?.[0] || res.message || 'Error al matricular');
      }
    } catch (e: any) {
      Toast.error(getAxiosErrorMessage(e));
    }
  };

  const onUnenroll = async (email: string) => {
    try {
      const res = await unenrollStudent(courseId, email);
      if (res.success || res.statusCode === 204) {
        Toast.success(res.message || 'Estudiante desmatriculado');
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getCourse] }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.getCourseMembers, courseId],
          }),
        ]);
      } else {
        Toast.error(
          res.errors?.[0] || res.message || 'No se pudo desmatricular',
        );
      }
    } catch (e: any) {
      Toast.error(getAxiosErrorMessage(e));
    }
  };

  // --- Confirmación des-matriculación ---
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const openConfirm = (email: string) => {
    setPendingEmail(email);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingEmail(null);
  };

  const confirmUnenroll = async () => {
    if (!pendingEmail) return;
    await onUnenroll(pendingEmail);
    closeConfirm();
  };

  const pages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / size)),
    [total, size],
  );

  const handleDismiss = () => {
    setOpen(false);
    reset({ email: '' });
    focusTrigger();
  };

  if (user?.role === UserRole.student) return null;

  return (
    <Card style={{ marginTop: 16 }}>
      <Card.Title
        title={`Estudiantes (${totalEnrollments ?? 0})`}
        right={props => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {canManage && (
              <Button
                ref={enrollBtnRef}
                mode="contained"
                onPress={() => setOpen(true)}
                style={{ marginRight: 4 }}
              >
                Matricular estudiante
              </Button>
            )}
            <IconButton
              {...props}
              icon={expanded ? 'chevron-up' : 'chevron-down'}
              onPress={toggleExpand}
            />
          </View>
        )}
      />

      {expanded && (
        <Card.Content>
          <View style={styles.tableCard}>
            {(isLoading || isFetching) && (
              <View style={styles.loading}>
                <Text>Cargando...</Text>
              </View>
            )}

            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 1.2 }}>Nombre</DataTable.Title>
                <DataTable.Title style={{ flex: 1.2 }}>
                  Apellido
                </DataTable.Title>
                <DataTable.Title style={{ flex: 2 }}>Email</DataTable.Title>
                <DataTable.Title>Rol</DataTable.Title>
                {canManage && <DataTable.Title>Acciones</DataTable.Title>}
              </DataTable.Header>

              {rows.map(u => (
                <DataTable.Row key={u.email}>
                  <DataTable.Cell style={{ flex: 1.2 }}>
                    {u.name}
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 1.2 }}>
                    {u.lastname}
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>{u.email}</DataTable.Cell>
                  <DataTable.Cell>
                    {u.role === 'ADMIN'
                      ? 'Admin'
                      : u.role === 'TEACHER'
                        ? 'Profesor'
                        : 'Estudiante'}
                  </DataTable.Cell>
                  {canManage && (
                    <DataTable.Cell>
                      {u.role === 'STUDENT' ? (
                        <Button
                          mode="contained-tonal"
                          buttonColor={THEME.colors.error}
                          textColor="#fff"
                          onPress={() => openConfirm(u.email)} // abre confirmación
                          style={{
                            borderRadius: 20,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                          }}
                        >
                          Des-matricular
                        </Button>
                      ) : (
                        <Text>—</Text>
                      )}
                    </DataTable.Cell>
                  )}
                </DataTable.Row>
              ))}

              {rows.length === 0 && !isLoading && (
                <DataTable.Row>
                  <DataTable.Cell>
                    <Text>No hay miembros en este curso.</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              )}

              <DataTable.Pagination
                page={page}
                numberOfPages={pages}
                onPageChange={setPage}
                label={
                  total === 0
                    ? '0 de 0'
                    : `${Math.min(total, page * size + 1)}-${Math.min(total, (page + 1) * size)} de ${total}`
                }
                numberOfItemsPerPage={size}
                onItemsPerPageChange={setSize}
                numberOfItemsPerPageList={[5, 10, 15, 20]}
                selectPageDropdownLabel="Filas por página"
                showFastPaginationControls
              />
            </DataTable>
          </View>
        </Card.Content>
      )}
      {/* Modal Matricular*/}
      {open && (
        <Portal>
          <Dialog visible onDismiss={handleDismiss} style={styles.dialog}>
            <Dialog.Title>Matricular Estudiante</Dialog.Title>

            <Dialog.Content style={styles.dialogContent}>
              <FormTextInput
                name="email"
                control={control}
                label="Email del estudiante"
                placeholder="e.g., student@example.com"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                outlineColor="#333333"
                activeOutlineColor={THEME.colors.secondary}
              />
            </Dialog.Content>

            <Dialog.Actions style={styles.dialogActions}>
              <Button onPress={handleDismiss}>Cancelar</Button>
              <Button mode="contained" onPress={handleSubmit(onEnroll)}>
                Matricular
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}

      {/* Confirmación des-matriculación*/}
      {confirmOpen && (
        <Portal>
          <Dialog visible onDismiss={closeConfirm} style={styles.dialog}>
            <Dialog.Title>Confirmar des-matriculación</Dialog.Title>
            <Dialog.Content style={styles.dialogContent}>
              <Text>
                ¿Querés des-matricular al estudiante
                {pendingEmail ? ` ${pendingEmail}` : ''} de este curso?
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button onPress={closeConfirm}>Cancelar</Button>
              <Button
                mode="contained-tonal"
                buttonColor={THEME.colors.error}
                textColor="#fff"
                onPress={confirmUnenroll}
              >
                Des-matricular
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  tableCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  loading: { paddingVertical: 12, alignItems: 'center' },

  dialog: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: 420,
    maxWidth: '90%',
    borderRadius: 12,
  },
  dialogContent: {
    paddingTop: 4,
  },
  dialogActions: {
    justifyContent: 'flex-end',
  },
});
