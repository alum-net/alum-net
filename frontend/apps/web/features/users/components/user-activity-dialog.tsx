import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Portal,
  Dialog,
  DataTable,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getUserActivity } from '../service';
import { QUERY_KEYS, type PageableResponse } from '@alum-net/api';
import type { UserActivityLog } from '../types';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  userEmail: string;
};

export default function UserActivityDialog({
  visible,
  onDismiss,
  userEmail,
}: Props) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (visible) setPage(0);
  }, [visible, userEmail]);

  const { data, isLoading, isError } = useQuery<
    PageableResponse<UserActivityLog>
  >({
    queryKey: [QUERY_KEYS.getUserActivity, userEmail, page],
    queryFn: () => getUserActivity(userEmail, page),
    enabled: visible && Boolean(userEmail),
  });

  const rows = data?.data ?? [];
  const total = data?.totalElements ?? 0;
  const pageSize = data?.size ?? 15;
  const numberOfPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>
          Registro de Actividad {userEmail ? `- ${userEmail}` : ''}
        </Dialog.Title>

        <Dialog.Content>
          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : isError ? (
            <Text>Error al cargar registros</Text>
          ) : rows.length === 0 ? (
            <Text>No hay registros de actividad para este usuario.</Text>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Descripción</DataTable.Title>
                <DataTable.Title numeric>Fecha</DataTable.Title>
              </DataTable.Header>

              {rows.map(r => (
                <DataTable.Row key={String(r.id)}>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {r.description ?? '—'}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {new Date(r.timestamp).toLocaleString()}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              <DataTable.Pagination
                page={page}
                numberOfPages={numberOfPages}
                onPageChange={setPage}
                label={
                  total === 0
                    ? '0 de 0'
                    : `${Math.min(total, page * pageSize + 1)}-${Math.min(
                        total,
                        (page + 1) * pageSize,
                      )} de ${total}`
                }
                showFastPaginationControls
                numberOfItemsPerPage={pageSize}
              />
            </DataTable>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss}>Cerrar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    width: 720,
    maxWidth: '95%',
    alignSelf: 'center',
  },
  center: { padding: 16, alignItems: 'center' },
});
