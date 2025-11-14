import React from 'react';
import { Button, Text } from 'react-native-paper';
import { Linking, StyleSheet } from 'react-native';
import { Submission } from '../types';

type Props = {
  submission: Submission | undefined;
  style?: object;
};

export const ViewSubmissionButton = ({ submission, style }: Props) => {
  if (submission?.fileUrl && submission?.fileName) {
    return (
      <Button
        icon="file-document-outline"
        mode="contained"
        onPress={() => Linking.openURL(submission.fileUrl!)}
        style={style}
        compact
      >
        Ver tarea
      </Button>
    );
  }

  return (
    <Text style={styles.noSubmissionText}>Sin entrega</Text>
  );
};

const styles = StyleSheet.create({
  noSubmissionText: {
    color: '#999',
    fontStyle: 'italic',
  },
});

