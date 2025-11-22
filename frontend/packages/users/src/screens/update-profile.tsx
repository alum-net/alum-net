import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text, Avatar, Button, Surface, HelperText } from 'react-native-paper';
import { FormTextInput, THEME, Toast } from '@alum-net/ui';
import { logout, updatePassword } from '@alum-net/auth';
import { useUserInfo } from '../hooks/useUserInfo';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AvatarFile, UpdatePayload } from '../types';
import { updateUser } from '../service';
import { QUERY_KEYS } from '@alum-net/api';

type ProfileFormData = {
  name: string;
  lastname: string;
};

export const MAX_FILE_SIZE = 10;

export function UpdateProfile() {
  const queryClient = useQueryClient();
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const { data: userInfo } = useUserInfo();
  const [avatar, setAvatar] = useState<AvatarFile>({
    uri: userInfo?.avatarUrl,
    filename: userInfo?.name + '_avatar',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: userInfo?.name,
      lastname: userInfo?.lastname,
    },
  });

  useEffect(() => {
    if (userInfo?.lastname) setValue('lastname', userInfo.lastname);
    if (userInfo?.name) setValue('name', userInfo.name);
    if (userInfo?.avatarUrl) setAvatar({ uri: userInfo.avatarUrl });
  }, [userInfo, setValue]);

  const mutation = useMutation({
    mutationFn: (data: UpdatePayload) => updateUser(userInfo!.email, data),
    onSuccess: async data => {
      Toast.success('Perfil actualizado satisfactoriamente');
      await queryClient.setQueryData([QUERY_KEYS.getUserInfo], () => data);
    },
    onError: () => {
      Toast.error('Ocurrio un error actualizando tu perfil');
    },
  });

  const pickImage = async () => {
    if (status?.status === ImagePicker.PermissionStatus.GRANTED) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        if (
          !(
            result.assets[0].fileSize &&
            result.assets[0].fileSize > MAX_FILE_SIZE * Math.pow(1024, 2)
          )
        ) {
          setAvatar({
            type:
              result.assets[0].mimeType ||
              result.assets[0].file?.type ||
              'image/jpeg',
            filename:
              result.assets[0].fileName ||
              result.assets[0].file?.name ||
              'avatar.jpg',
            uri: result.assets[0].uri,
          });
          return;
        }
        Toast.error('El archivo es demasiado pesado');
      }
    } else {
      const newStatus = await requestPermission();
      if (newStatus.granted) pickImage();
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate({ ...data, avatar });
  };

  return (
    <View style={styles.container}>
      <Surface elevation={5} style={styles.surface}>
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.avatarContainer, styles.alginChild]}
        >
          {avatar.uri ? (
            <Avatar.Image
              source={{ uri: avatar.uri }}
              style={styles.avatarImage}
            />
          ) : (
            <Avatar.Icon size={60} icon="account-edit" />
          )}
        </TouchableOpacity>

        <Text variant="titleLarge" style={[styles.name, styles.alginChild]}>
          {userInfo?.name + ' ' + userInfo?.lastname}
        </Text>

        <Text variant="bodyLarge" style={styles.editLabel}>
          Editar Perfil
        </Text>
        <FormTextInput control={control} label={'Nombre'} name="name" />
        {errors.name && (
          <HelperText type="error">{errors.name.message}</HelperText>
        )}

        <FormTextInput control={control} label={'Apellido'} name="lastname" />
        {errors.lastname && (
          <HelperText type="error">{errors.lastname.message}</HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          loading={mutation.isPending}
        >
          Guardar Cambios
        </Button>
        <Button mode="outlined" onPress={updatePassword}>
          Actualizar contraseña
        </Button>
        <Button
          mode="outlined"
          onPress={logout}
          style={{ borderColor: 'red' }}
          textColor="red"
        >
          Cerrar sesión
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 16,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    padding: 16,
    backgroundColor: THEME.colors.background,
    gap: 20,
    width: Platform.OS === 'web' ? '70%' : '100%',
  },
  avatarContainer: {
    marginVertical: 12,
  },
  avatarImage: {
    borderRadius: 40,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  editLabel: {
    alignSelf: 'flex-start',
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    width: '100%',
  },
  alginChild: {
    alignSelf: 'center',
  },
});
