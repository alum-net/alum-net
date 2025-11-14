import { useEffect } from 'react';
import { QUERY_KEYS } from '@alum-net/api';
import { createPost, updatePost } from '../service';
import { ForumType, Post } from '../types';
import {
  FormTextInput,
  RichTextEditor,
  Toast,
  useRichTextEditor,
} from '@alum-net/ui';
import { useUserInfo } from '@alum-net/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button, Dialog, HelperText, Portal } from 'react-native-paper';

import { z } from 'zod';
import { isAxiosError } from 'axios';

const titleValidation = z.string().min(1, 'El título no puede estar vacío');

const basePostSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
});

const postCreationSchema = basePostSchema.extend({
  title: titleValidation,
});

const postUpdateSchema = basePostSchema.extend({
  title: titleValidation,
});

const replySchema = z.object({
  content: z.string(),
});

export type PostCreationSchema = z.infer<typeof postCreationSchema>;
export type PostUpdateSchema = z.infer<typeof postUpdateSchema>;
export type ReplySchema = z.infer<typeof replySchema>;

interface PostCreationFormProps {
  forumType: ForumType;
  courseId: number;
  updateInitialData?: Post;
  creationParentPost?: string;
  creationRootPost?: string;
  onDismiss: () => void;
  isVisible: boolean;
}

export const PostCreationForm = ({
  forumType,
  courseId,
  updateInitialData,
  creationParentPost,
  creationRootPost,
  onDismiss,
  isVisible,
}: PostCreationFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PostCreationSchema | PostUpdateSchema | ReplySchema>({
    resolver: zodResolver(
      updateInitialData
        ? updateInitialData.parentPost
          ? replySchema
          : postUpdateSchema
        : creationParentPost
          ? replySchema
          : postCreationSchema
    ),
    defaultValues: {
      title: updateInitialData?.title || '',
      content: updateInitialData?.content || '',
    },
  });

  const { editor, content } = useRichTextEditor(
    updateInitialData?.content || '',
  );

  useEffect(() => {
    if (!isVisible && !updateInitialData && !creationParentPost) {
      reset({
        title: '',
        content: '',
      });
    }
  }, [isVisible, updateInitialData, creationParentPost, reset]);
  const { data: userInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const { mutate: createMutate } = useMutation({
    mutationFn: (data: PostCreationSchema | ReplySchema) =>
      createPost({
        forumType,
        courseId,
        author: { email: userInfo!.email, name: userInfo!.name },
        title: creationParentPost ? undefined : (data as PostCreationSchema).title,
        content: data.content,
        parentPost: creationParentPost,
        rootPost: creationRootPost,
      }),
    onSuccess: async () => {
      Toast.success('Posteo creado correctamente');
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getForumPosts],
      });
      reset({
        title: '',
        content: '',
      });
      onDismiss();
      reset();
    },
    onError: (error: any) => {
      const errorMessage = 
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        'Error de cantidad de caracteres';
      Toast.error(errorMessage);
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: (data: PostUpdateSchema | ReplySchema) =>
      updatePost(updateInitialData!.id, {
        title: updateInitialData?.parentPost ? undefined : (data as PostUpdateSchema).title,
        content: data.content,
      }),
    onSuccess: async () => {
      Toast.success('Posteo actualizado correctamente');
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getForumPosts],
      });
      onDismiss();
      reset();
    },
    onError: (error: any) => {
      const errorMessage = 
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        'Error de cantidad de caracteres';
      Toast.error(errorMessage);
    },
  });

  const onSubmit = () => {
    const contentValue = content || '';
    const contentLength = contentValue.length;
    
    if (contentLength < 8) {
      Toast.error('El mensaje debe tener al menos 8 caracteres');
      return;
    }
    
    if (contentLength > 350) {
      Toast.error('El mensaje supera los 350 caracteres');
      return;
    }
    
    setValue('content', contentValue);
    handleSubmit(data => {
      if (updateInitialData) {
        updateMutate(data as PostUpdateSchema | ReplySchema);
      } else {
        createMutate(data as PostCreationSchema | ReplySchema);
      }
    })();
  };

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onDismiss}>
        <Dialog.Title>
          {updateInitialData ? 'Editar publicación' : 'Nueva publicación'}
        </Dialog.Title>
        <Dialog.Content style={{ gap: 20 }}>
          {!creationParentPost && !updateInitialData?.parentPost && (
            <FormTextInput
              control={control}
              name="title"
              label="Título"
              mode="outlined"
            />
          )}
          {'title' in errors && errors.title && (
            <HelperText type="error">{errors.title.message}</HelperText>
          )}
          <RichTextEditor editor={editor} />
          {errors.content && (
            <HelperText type="error">{errors.content.message}</HelperText>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="outlined" onPress={onDismiss}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={onSubmit}>
            {updateInitialData ? 'Actualizar' : 'Crear'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
