import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, RadioButton } from 'react-native-paper';
import { useMutation } from '@tanstack/react-query';
import { Event } from '../types';
import { Toast } from '@alum-net/ui';
import { UserInfo } from '@alum-net/users';
import {
  submitQuestionnaireResponses,
  SubmitQuestionnaireRequest,
} from '../service';

type Question = {
  id: string;
  numericId?: number;
  text: string;
  options: string[];
  correctOption?: number;
};

type QuestionnaireDetailsProps = {
  data?: Event;
  eventId?: string | number;
  userInfo?: UserInfo | null;
};

export const QuestionnaireDetails: React.FC<QuestionnaireDetailsProps> = ({
  data,
  eventId,
  userInfo,
}) => {
  const questions = useMemo(
    () =>
      data?.questions?.map((q: unknown) => {
        const qObj = q as unknown as {
          id?: string | number;
          text?: string;
          options?: unknown;
          correctOption?: number;
        };
        const id =
          qObj.id !== undefined
            ? String(qObj.id)
            : Math.random().toString(36).slice(2);
        const text = typeof qObj.text === 'string' ? qObj.text : '';
        const options = Array.isArray(qObj.options)
          ? qObj.options.map(opt => String(opt))
          : [];
        const correctOption =
          typeof qObj.correctOption === 'number'
            ? qObj.correctOption
            : undefined;
        const numericId = typeof qObj.id === 'number' ? qObj.id : undefined;
        return { id, numericId, text, options, correctOption } as Question;
      }) ?? [],
    [data],
  );

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalQuestions = questions?.length;

  const title = data?.title || 'Cuestionario sin título';
  const description = data?.description || 'Sin descripción';
  const startDate = data?.startDate
    ? new Date(data.startDate).toLocaleString()
    : 'Sin fecha';
  const dataRecord = data as unknown as Record<string, unknown> | undefined;
  const timeLimit =
    typeof dataRecord?.timeLimit === 'number'
      ? (dataRecord.timeLimit as number)
      : null;
  const maxPoints = data?.maxGrade ?? 0;
  const manual =
    typeof dataRecord?.manual === 'string'
      ? (dataRecord.manual as string)
      : 'Siga las instrucciones del docente para completar la evaluación.';

  const currentQuestion = questions?.[currentIndex];

  const selectAnswer = (questionId: string, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(i => i + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleStart = () => {
    setStarted(true);
    setCurrentIndex(0);
  };

  const mutation = useMutation({
    mutationFn: (body: SubmitQuestionnaireRequest) =>
      submitQuestionnaireResponses(eventId || 0, body),
    onSuccess: () => {
      setSubmitted(true);
      Toast.success('Respuestas enviadas correctamente');
    },
    onError: err => {
      console.error(err);
      Toast.error('Error al enviar las respuestas');
    },
  });

  const handleSubmit = () => {
    Alert.alert(
      'Enviar respuestas',
      'Una vez enviadas, las respuestas no se podrán modificar. ¿Desea continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar respuestas',
          onPress: () => {
            const responsesPayload = Object.entries(answers).map(
              ([questionId, selected]) => {
                const q = questions?.find(q => q.id === questionId) as
                  | Question
                  | undefined;
                const selectedIndex = q
                  ? q.options.findIndex(opt => opt === selected)
                  : -1;
                const questionNumericId = q?.numericId ?? Number(questionId);
                const isCorrect =
                  typeof q?.correctOption === 'number'
                    ? selectedIndex === q!.correctOption
                    : false;
                return {
                  questionId: questionNumericId,
                  answerId: selectedIndex >= 0 ? selectedIndex : -1,
                  isCorrect,
                  timeStamp: new Date().toISOString(),
                };
              },
            );

            const payload: SubmitQuestionnaireRequest = {
              userEmail: userInfo?.email,
              responses: responsesPayload,
            };

            mutation.mutate(payload);
          },
        },
      ],
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={`Título del cuestionario: ${title}`}
        titleVariant="headlineSmall"
      />
      <Card.Content>
        <Text variant="bodyLarge" style={styles.field}>
          <Text style={{ fontWeight: '700' }}>Descripción: </Text>
          {description}
        </Text>

        <Text variant="bodyLarge" style={styles.field}>
          <Text style={{ fontWeight: '700' }}>
            Fecha desde cuándo se reciben respuestas:{' '}
          </Text>
          {startDate}
        </Text>

        <Text variant="bodyLarge" style={styles.field}>
          <Text style={{ fontWeight: '700' }}>Tiempo disponible: </Text>
          {timeLimit ? `${timeLimit} minutos` : 'No especificado'}
        </Text>

        <Text variant="bodyLarge" style={styles.field}>
          <Text style={{ fontWeight: '700' }}>Puntos posibles: </Text>
          {maxPoints}
        </Text>

        <Text variant="bodyLarge" style={styles.field}>
          <Text style={{ fontWeight: '700' }}>Cantidad de preguntas: </Text>
          {totalQuestions}
        </Text>

        <Text variant="bodyLarge" style={styles.field}>
          <Text style={{ fontWeight: '700' }}>
            Manual para completar la evaluación:{' '}
          </Text>
          {manual}
        </Text>

        {!started && (
          <Button
            mode="contained"
            onPress={handleStart}
            style={styles.startButton}
          >
            Comenzar cuestionario
          </Button>
        )}

        {started && (
          <View style={styles.quizBox}>
            <Text variant="titleMedium">
              Pregunta {currentIndex + 1} de {totalQuestions}
            </Text>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>

            <RadioButton.Group
              onValueChange={value => selectAnswer(currentQuestion.id, value)}
              value={answers[currentQuestion.id] || ''}
            >
              {currentQuestion.options.map((opt, idx) => (
                <RadioButton.Item key={idx} label={opt} value={opt} />
              ))}
            </RadioButton.Group>

            <View style={styles.navRow}>
              <Button
                mode="outlined"
                onPress={handlePrevious}
                disabled={currentIndex === 0 || submitted}
              >
                Anterior pregunta
              </Button>
              {currentIndex < totalQuestions - 1 ? (
                <Button
                  mode="contained"
                  onPress={handleNext}
                  disabled={submitted}
                >
                  Siguiente pregunta
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  disabled={submitted}
                >
                  Enviar respuestas
                </Button>
              )}
            </View>

            <View style={{ marginTop: 12 }}>
              <Button mode="text" onPress={handleSkip} disabled={submitted}>
                Omitir pregunta
              </Button>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  field: {
    marginBottom: 12,
  },
  startButton: {
    marginTop: 12,
  },
  quizBox: {
    marginTop: 12,
  },
  questionText: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});

export default QuestionnaireDetails;
