import { EditorBridge, RichText, Toolbar } from '@10play/tentap-editor';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { MARKDOWN_TOOLBAR_ITEMS } from '../constants';

export const RichTextEditor = ({ editor }: { editor: EditorBridge }) => (
  <View style={styles.editorContainer}>
    <RichText editor={editor} />
    <KeyboardAvoidingView
      style={{
        position: 'absolute',
        width: '104%',
        bottom: 0,
      }}
    >
      <Toolbar
        editor={editor}
        items={[...MARKDOWN_TOOLBAR_ITEMS]}
        hidden={false}
      />
    </KeyboardAvoidingView>
  </View>
);

const styles = StyleSheet.create({
  editorContainer: {
    height: 500,
    maxHeight: 500,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    backgroundColor: 'white',
  },
});
