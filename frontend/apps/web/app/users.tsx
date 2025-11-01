'use dom';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, DataTable, ActivityIndicator, Menu, } from 'react-native-paper';
import { FormTextInput, THEME } from '@alum-net/ui';
import { useForm } from 'react-hook-form';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { type UserInfo, type UserFilterDTO, UserRole } from '@alum-net/users/src/types';
import { fetchUsers } from '@alum-net/users/src/service';

import CreateUserModal from '../features/users/src/create-user';
import UsersDashboard from '../features/users/src/users-dashboard';
import BulkUserUploadModal from '../features/users/src/bulk-user-upload-modal';

type FormData = { name: string; lastname: string; email: string };

const ROLE_OPTIONS: Array<{ value: '' | UserRole; label: string }> = [
  { value: '' as const, label: 'Todos los roles' },
  { value: UserRole.admin, label: 'Admin' },
  { value: UserRole.teacher, label: 'Profesor' },
  { value: UserRole.student, label: 'Estudiante' },
];

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [bulkModalVisible, setBulkModalVisible] = useState(false);

  // paginación
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // filtros
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { name: '', lastname: '', email: '' },
  });
  const [role, setRole] = useState<'' | UserRole>('');
  const [roleMenuVisible, setRoleMenuVisible] = useState(false);
  const [filters, setFilters] = useState<UserFilterDTO>({});

  // Query lista usuarios
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.getUsers, page, size, filters],
    queryFn: () => fetchUsers({ page, size, filter: filters }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const rows: UserInfo[] = data?.data ?? [];
  const total = data?.totalElements ?? 0;

  const onApplyFilters = (f: FormData) => {
    setPage(0);
    setFilters({
      name: f.name?.trim(),
      lastname: f.lastname?.trim(),
      email: f.email?.trim(),
      role,
    });
  };

  const onClearFilters = () => {
    reset({ name: '', lastname: '', email: '' });
    setRole('');
    setPage(0);
    setFilters({});
  };

  return (
    <UsersDashboard>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall">Usuarios</Text>
        
        <View style={styles.buttonGroup}>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => setOpen(true)}
          >
            Crear nuevo usuario
          </Button>

          <Button
            mode="contained"
            icon="upload"
            onPress={() => setBulkModalVisible(true)}
            style={styles.bulkButton}
          >
            Carga masiva de usuarios
          </Button>
        </View>
      </View>

      <View style={styles.filterBar}>
        <FormTextInput
          name="name"
          control={control}
          label="Nombre"
          mode="outlined"
          style={styles.input}
          outlineColor="#333333"
          activeOutlineColor={THEME.colors.secondary}
        />
        <FormTextInput
          name="lastname"
          control={control}
          label="Apellido"
          mode="outlined"
          style={styles.input}
          outlineColor="#333333"
          activeOutlineColor={THEME.colors.secondary}
        />
        <FormTextInput
          name="email"
          control={control}
          label="Email"
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          outlineColor="#333333"
          activeOutlineColor={THEME.colors.secondary}
        />

        <Menu
          visible={roleMenuVisible}
          onDismiss={() => setRoleMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setRoleMenuVisible(true)}
              style={styles.roleButton}
              labelStyle={styles.roleButtonLabel}
              icon="chevron-down"
              contentStyle={styles.roleButtonContent}
            >
              {ROLE_OPTIONS.find(r => r.value === role)?.label ??
                'Todos los roles'}
            </Button>
          }
          contentStyle={styles.menuContent}
        >
          {ROLE_OPTIONS.map(opt => (
            <Menu.Item
              key={opt.value || 'all'}
              onPress={() => {
                setRole(opt.value);
                setRoleMenuVisible(false);
              }}
              title={opt.label}
              titleStyle={styles.menuItemTitle}
            />
          ))}
        </Menu>

        <Button mode="outlined" onPress={onClearFilters}>
          Limpiar
        </Button>
        <Button mode="contained" onPress={handleSubmit(onApplyFilters)}>
          Buscar
        </Button>
      </View>

      <View style={styles.tableCard}>
        {(isLoading || isFetching) && (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        )}

        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={{ flex: 1.2 }}>Nombre</DataTable.Title>
            <DataTable.Title style={{ flex: 1.2 }}>Apellido</DataTable.Title>
            <DataTable.Title style={{ flex: 2 }}>Email</DataTable.Title>
            <DataTable.Title>Rol</DataTable.Title>
            <DataTable.Title>Estado</DataTable.Title>
          </DataTable.Header>

          {rows.map(u => (
            <DataTable.Row key={u.email}>
              <DataTable.Cell style={{ flex: 1.2 }}>{u.name}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 1.2 }}>
                {u.lastname}
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 2 }}>
                {u.email}
              </DataTable.Cell>
              <DataTable.Cell>
                {u.role === 'ADMIN'
                  ? 'Admin'
                  : u.role === 'TEACHER'
                  ? 'Profesor'
                  : 'Estudiante'}
              </DataTable.Cell>
              <DataTable.Cell>
                {u.enabled ? 'Activo' : 'Inactivo'}
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          {rows.length === 0 && !isLoading && (
            <DataTable.Row>
              <DataTable.Cell>
                <Text>
                  No se encontraron usuarios que coincidan con los filtros.
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          )}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.max(1, Math.ceil(total / size))}
            onPageChange={setPage}
            label={
              total === 0
                ? '0 de 0'
                : `${Math.min(total, page * size + 1)}-${Math.min(
                    total,
                    (page + 1) * size,
                  )} de ${total}`
            }
            showFastPaginationControls
            numberOfItemsPerPage={size}
            onItemsPerPageChange={setSize}
            numberOfItemsPerPageList={[5, 10, 15, 20]}
            selectPageDropdownLabel={'Filas por página'}
          />
        </DataTable>
      </View>
      
      <CreateUserModal visible={open} onDismiss={() => setOpen(false)} />
    
      <BulkUserUploadModal
        visible={bulkModalVisible}
        onDismiss={() => setBulkModalVisible(false)}
      />
      
    </UsersDashboard>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },

  bulkButton: {
    backgroundColor: THEME.colors.primary,
  },

  filterBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: { flex: 1, minWidth: 180 },

  roleButton: {
    borderColor: '#333333',
    backgroundColor: THEME.colors.black,
    minWidth: 180,
  },
  roleButtonLabel: { color: '#ffffff' },
  roleButtonContent: { flexDirection: 'row-reverse' },
  menuContent: { backgroundColor: THEME.colors.black },
  menuItemTitle: { color: '#ffffff' },

  tableCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  loading: { paddingVertical: 12, alignItems: 'center' },
});
