import Screen from '../../components/screen';
import { LibraryDashboard } from '@alum-net/library';
import { Text } from 'react-native-paper';

export default function Library() {
  return (
    <Screen>
      <Text variant="headlineLarge">Bienvenido a la libreria!</Text>
      <LibraryDashboard deleteLabel={undefined} deleteResource={undefined} />
    </Screen>
  );
}
