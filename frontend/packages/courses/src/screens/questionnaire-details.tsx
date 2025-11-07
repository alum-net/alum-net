import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Card,
  Text,
  Button,
  RadioButton,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useMutation } from '@tanstack/react-query';
import {
  Event,
  Question as EventQuestion,
  Answer as EventAnswer,
} from '../types';
import { Toast } from '@alum-net/ui';
import { UserInfo, UserRole } from '@alum-net/users';
import {
  submitQuestionnaireResponses,
  SubmitQuestionnaireRequest,
} from '../service';

type QuestionnaireDetailsProps = {
  data?: Event;
  eventId?: string | number;
  userInfo?: UserInfo;
};

const manual =
  'Una vez comience el cuestionario, tendras los minutos disponibles para completarlo, si no lo completas en el tiempo indicado no podras completar el questionario.';

export const QuestionnaireDetails: React.FC<QuestionnaireDetailsProps> = ({
  data,
  eventId,
  userInfo,
}) => {
  const questions = useMemo(() => {
    const raw = data?.questions ?? [];
    return (raw as EventQuestion[]).map(q => {
      const answersArr: EventAnswer[] = Array.isArray(
        (q as unknown as Record<string, unknown>).answers,
      )
        ? ((q as unknown as Record<string, unknown>)
            .answers as unknown as EventAnswer[])
        : ([
            (q as unknown as Record<string, unknown>).answers as unknown,
          ] as unknown as EventAnswer[]);
      return {
        ...(q as unknown as Record<string, unknown>),
        answers: answersArr,
      } as unknown as EventQuestion;
    });
  }, [data]);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const totalQuestions = questions?.length;

  const title = data?.title || 'Cuestionario sin título';
  const description = data?.description || 'Sin descripción';
  const startDate = data?.startDate
    ? new Date(data.startDate).toLocaleString()
    : 'Sin fecha';
  const endDate = data?.endDate
    ? new Date(data.endDate).toLocaleString()
    : 'Sin fecha';

  const currentQuestion = questions?.[currentIndex];

  const selectAnswer = (questionId: number, answerId: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
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
    // initialize timer if duration is provided
    const mins = data?.durationInMinutes ?? null;
    if (typeof mins === 'number' && mins > 0) {
      setRemainingSeconds(mins * 60);
    }
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
  const [confirmVisible, setConfirmVisible] = useState(false);

  const buildResponsesPayload = () =>
    Object.entries(answers).map(([questionIdStr, selectedAnswerId]) => {
      const questionId = Number(questionIdStr);
      const q = questions?.find(q => q.id === questionId) as
        | EventQuestion
        | undefined;
      const answerId = Number(selectedAnswerId ?? -1);
      const answerObj = (q?.answers as unknown as EventAnswer[])?.find(
        (a: EventAnswer) => a.id === answerId,
      );
      const isCorrect = !!answerObj?.correct;
      return {
        questionId,
        answerId: answerId >= 0 ? answerId : -1,
        isCorrect,
        timeStamp: new Date().toISOString(),
      };
    });

  const handleSubmit = () => {
    // show confirmation modal (works on web and native)
    setConfirmVisible(true);
  };

  const confirmSubmit = () => {
    setConfirmVisible(false);
    const responsesPayload = buildResponsesPayload();
    const payload: SubmitQuestionnaireRequest = {
      userEmail: userInfo?.email,
      responses: responsesPayload,
    };
    mutation.mutate(payload);
  };

  // helper to auto-submit without confirmation (used when timer expires)
  const autoSubmit = () => {
    if (submitted) return;
    const responsesPayload = Object.entries(answers).map(
      ([questionIdStr, selectedAnswerId]) => {
        const questionId = Number(questionIdStr);
        const q = questions?.find(q => q.id === questionId) as
          | EventQuestion
          | undefined;
        const answerId = Number(selectedAnswerId ?? -1);
        const answerObj = (q?.answers as unknown as EventAnswer[])?.find(
          (a: EventAnswer) => a.id === answerId,
        );
        const isCorrect = !!answerObj?.correct;
        return {
          questionId,
          answerId: answerId >= 0 ? answerId : -1,
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
  };

  // Timer effect: decrement every second; when reaches 0 auto-submit
  useEffect(() => {
    // start timer only after user started and there is a remainingSeconds value
    if (!started || submitted || remainingSeconds === null) return;

    // clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          // time's up: clear timer and auto-submit
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // run auto submit
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // only restart when started or submitted changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, submitted]);

  return (
    <Card style={styles.card} mode="contained">
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
          <Text style={{ fontWeight: '700' }}>
            Fecha hasta cuando se reciben respuestas:{' '}
          </Text>
          {endDate}
        </Text>

        <Text variant="bodyLarge" style={styles.field}>
          <Text style={{ fontWeight: '700' }}>Tiempo disponible: </Text>
          {data?.durationInMinutes
            ? `${data.durationInMinutes} minutos`
            : 'No especificado'}
        </Text>

        <Text variant="bodyLarge" style={styles.field}>
          <Text style={{ fontWeight: '700' }}>Puntos posibles: </Text>
          {data?.maxGrade}
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

        {userInfo?.role === UserRole.teacher ? (
          <View style={styles.teacherBox}>
            <Text variant="titleLarge" style={{ marginBottom: 8 }}>
              Preguntas
            </Text>
            {questions.map((q, qi) => (
              <View key={q.id} style={styles.teacherQuestion}>
                <Text
                  style={{ fontWeight: '700' }}
                >{`Pregunta ${qi + 1}: ${q.text}`}</Text>
                {(q.answers as unknown as EventAnswer[]).map(ans => (
                  <View key={ans.id} style={styles.teacherOptionRow}>
                    <Text style={{ color: ans.correct ? '#2e7d32' : '#000' }}>
                      {ans.text}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <>
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
                {remainingSeconds !== null && (
                  <Text variant="bodyLarge" style={{ marginBottom: 8 }}>
                    <Text style={{ fontWeight: '700' }}>Tiempo restante: </Text>
                    {Math.floor((remainingSeconds ?? 0) / 60)}:
                    {String((remainingSeconds ?? 0) % 60).padStart(2, '0')}
                  </Text>
                )}
                <Text variant="titleMedium">
                  Pregunta {currentIndex + 1} de {totalQuestions}
                </Text>
                <Text style={styles.questionText}>{currentQuestion.text}</Text>

                <RadioButton.Group
                  onValueChange={value =>
                    selectAnswer(currentQuestion.id, Number(value))
                  }
                  value={
                    answers[currentQuestion.id]
                      ? String(answers[currentQuestion.id])
                      : ''
                  }
                >
                  {(currentQuestion.answers as unknown as EventAnswer[]).map(
                    ans => (
                      <RadioButton.Item
                        key={ans.id}
                        label={ans.text}
                        value={String(ans.id)}
                      />
                    ),
                  )}
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
            <Portal>
              <Dialog
                visible={confirmVisible}
                onDismiss={() => setConfirmVisible(false)}
              >
                <Dialog.Title>Enviar respuestas</Dialog.Title>
                <Dialog.Content>
                  <Text>
                    Una vez enviadas, las respuestas no se podrán modificar.
                    ¿Desea continuar?
                  </Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setConfirmVisible(false)}>
                    Cancelar
                  </Button>
                  <Button mode="contained" onPress={confirmSubmit}>
                    Enviar respuestas
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </>
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
  teacherBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 6,
  },
  teacherQuestion: {
    marginBottom: 12,
  },
  teacherOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
});

export default QuestionnaireDetails;
