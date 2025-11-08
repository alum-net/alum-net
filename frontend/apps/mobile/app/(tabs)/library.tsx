import { THEME } from '@alum-net/ui';
import Screen from '../../components/screen';
import { LibraryContextProvider, LibraryDashboard } from '@alum-net/library';
import { PropsWithChildren, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Divider, Portal, Text } from 'react-native-paper';

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});

const FilterContainer = ({ children }: PropsWithChildren) => {
  const [displayFilters, setDisplayFilters] = useState(false);

  return (
    <>
      <Button
        mode="elevated"
        style={{ marginVertical: 10 }}
        onPress={() => setDisplayFilters(true)}
      >
        Filtros
      </Button>
      <Modal
        onRequestClose={() => setDisplayFilters(false)}
        visible={displayFilters}
        backdropColor={THEME.colors.backdrop}
        animationType="fade"
      >
        <Portal.Host>
          <View style={styles.modalContainer}>
            {children}
            <Divider />
            <Button onPress={() => setDisplayFilters(false)} mode="elevated">
              Aplicar
            </Button>
          </View>
        </Portal.Host>
      </Modal>
    </>
  );
};

export default function Library() {
  return (
    <Screen scrollable={false}>
      <Text variant="headlineLarge">Bienvenido a la libreria!</Text>
      <LibraryContextProvider>
        <LibraryDashboard
          deleteLabel={undefined}
          deleteResource={undefined}
          filterContainer={FilterContainer}
        />
      </LibraryContextProvider>
    </Screen>
  );
}
