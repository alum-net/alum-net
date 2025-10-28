import { useEditorBridge, useEditorContent } from '@10play/tentap-editor';

export const useRichTextEditor = (initialContent: string) => {
  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: initialContent,
  });
  const editorContent = useEditorContent(editor, {
    type: 'html',
  });

  return {
    editor,
    content: editorContent,
  };
};
