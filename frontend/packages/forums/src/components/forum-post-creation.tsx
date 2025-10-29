import { QUERY_KEYS } from '@alum-net/api';
import { createPost } from '../service';
import { ForumType, Post } from '../types';
import {
  FormTextInput,
  RichTextEditor,
  Toast,
  useRichTextEditor,
} from '@alum-net/ui';
import { useUserInfo } from '@alum-net/users';
import { UserRole } from '@alum-net/users/src/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button, Dialog, FAB, HelperText, Portal } from 'react-native-paper';

import { z } from 'zod';
const schema = z.object({
  title: z.string().min(1, 'El titulo es requerido'),
  content: z.string().min(8, 'El contenido es requerido'),
});

export type PostCreationSchema = z.infer<typeof schema>;

export const PostCreationForm = ({
  forumType,
  courseId,
  updateInitialData,
  onUpdate,
  creationParentPost,
  creationRootPost,
}: {
  forumType: ForumType;
  courseId: number;
  updateInitialData?: Post;
  onUpdate?: (data: Post) => void;
  creationParentPost?: string;
  creationRootPost?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PostCreationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const { editor, content } = useRichTextEditor('');
  const { data: userInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ title, content }: PostCreationSchema) =>
      createPost({
        forumType,
        courseId,
        author: { email: userInfo!.email, name: userInfo!.name },
        title: title,
        content: content,
      }),
    onSuccess: () => {
      Toast.success('Posteo creado correctamente');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getForumPosts] });
      setIsVisible(false);
    },
    onError: () => {
      Toast.error('Error creando posteo');
    },
  });

  if (
    userInfo?.role === UserRole.admin ||
    (userInfo?.role === UserRole.student && forumType === ForumType.ANNOUNCE)
  )
    return null;

  const onSubmit = () => {
    setValue('content', content || '');
    handleSubmit((data: PostCreationSchema) => mutate(data))();
  };

  return (
    <>
      <FAB
        icon="plus"
        label="Nueva publicación"
        style={styles.fab}
        onPress={() => setIsVisible(true)}
      />
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Title>Nueva publicación</Dialog.Title>
          <Dialog.Content style={{ gap: 20 }}>
            <FormTextInput
              control={control}
              name="title"
              label="Titulo"
              mode="outlined"
            />
            {errors.title && (
              <HelperText type="error">{errors.title.message}</HelperText>
            )}
            <RichTextEditor editor={editor} />
            {errors.content && (
              <HelperText type="error">{errors.content.message}</HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="outlined" onPress={() => setIsVisible(false)}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={onSubmit}>
              Crear
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
});
