'use dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '@alum-net/ui';
import { FilesToUpload } from '../types';

export const SortableFileItem = ({
  file,
  index,
  onRemove,
}: {
  file: FilesToUpload;
  index: number;
  onRemove: (index: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.name + index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...styles.fileItem, ...style }}
      {...attributes}
    >
      <MaterialCommunityIcons
        name="drag"
        size={20}
        color="#555"
        style={{ marginRight: 8 }}
        {...listeners}
      />
      <Text style={{ flex: 1 }}>{file.name}</Text>
      <Button compact onPress={() => onRemove(index)}>
        Eliminar
      </Button>
    </div>
  );
};

const styles = StyleSheet.create({
  fileItem: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#433b3bff',
    backgroundColor: THEME.colors.background,
    borderRadius: 4,
    padding: 8,
    marginTop: 6,
    width: '50%',
  },
});
