import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, Divider } from 'react-native-paper';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { THEME, Toast } from '@alum-net/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { createEvent } from '../service';
import { SectionOption } from '../types';
import FormDateInput from '../../../components/date-input';
import SelectField from './select-field';

const answerSchema = z.object({
  text: z.string().trim().min(1, 'La respuesta no puede estar vacía'),
  correct: z.boolean(),
});

const questionSchema = z.object({
  text: z.string().trim().min(5, 'Mínimo 5 caracteres').max(500),
  answers: z.array(answerSchema).min(2, 'Al menos dos opciones'),
}).refine(
  (question) => question.answers.some((answer) => answer.correct),
  { message: 'Debe haber al menos una respuesta correcta', path: ['answers'] }
);

const baseEventFields = {
  sectionId: z.number().int().positive('Debe seleccionar una sección'),
  title: z.string().trim().min(3, 'Mínimo 3 caracteres').max(120, 'Máximo 120'),
  description: z.string().trim().min(1, 'La descripción es requerida').max(2000, 'Máximo 2000'),
  startDateOnly: z.string().min(1, 'Requerido'),
  startTimeOnly: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:mm'),
  endDateOnly: z.string().min(1, 'Requerido'),
  endTimeOnly: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:mm'),
  maxGrade: z.number().int().min(0, 'Mínimo 0').max(100, 'Máximo 100'),
};

const taskSchema = z.object({
  type: z.literal('task'),
  ...baseEventFields,
});

const onsiteSchema = z.object({
  type: z.literal('on-site'),
  ...baseEventFields,
});

const questionnaireSchema = z.object({
  type: z.literal('questionnaire'),
  ...baseEventFields,
  durationInMinutes: z.number().int().min(1, 'Mínimo 1 minuto').max(600, 'Máximo 600 minutos'),
  questions: z.array(questionSchema).min(1, 'Agregá al menos una pregunta'),
});

const eventSchema = z.discriminatedUnion('type', [taskSchema, onsiteSchema, questionnaireSchema]);
export type EventFormData = z.infer<typeof eventSchema>;

type Props = {
  visible: boolean;
  onClose: () => void;
  courseId: string;
  sections: SectionOption[];
};

export default function EventCreationModal({ visible, onClose, courseId, sections }: Props) {
  const queryClient = useQueryClient();

  const defaultValues: EventFormData = {
    type: 'task',
    sectionId: sections[0]?.id ?? 0,
    title: '',
    description: '',
    startDateOnly: '',
    startTimeOnly: '08:00',
    endDateOnly: '',
    endTimeOnly: '23:59',
    maxGrade: 100,
  } as EventFormData;

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  const selectedEventType = watch('type');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions' as never,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (formData: EventFormData) => {
      const payload = {
        ...formData,
        startDate: `${formData.startDateOnly} ${formData.startTimeOnly}`,
        endDate: `${formData.endDateOnly} ${formData.endTimeOnly}`,
      };
  
      delete (payload as any).startDateOnly;
      delete (payload as any).startTimeOnly;
      delete (payload as any).endDateOnly;
      delete (payload as any).endTimeOnly;
  
      return await createEvent(courseId, payload as any);
    },
    onSuccess: () => {
      Toast.success('Evento creado correctamente');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getCourse] });
      reset(defaultValues);
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error?.message ?? 'No se pudo crear el evento';
      Toast.error(errorMessage);
    },
  });
  
  const handleFormSubmit = async (data: EventFormData) => {
    try {
      await mutateAsync(data);
    } catch (error) {
    }
  };
  
  const sectionOptions = useMemo(
    () => sections.map((section) => ({ 
      label: section.title, 
      value: String(section.id) 
    })),
    [sections]
  );

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose} style={styles.dialog}>
        <Dialog.Title style={styles.title}>Añadir nuevo evento</Dialog.Title>

        <Dialog.Content style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>

              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Tipo de evento</Text>
                <SelectField<EventFormData>
                  name="type"
                  control={control}
                  label=""
                  options={[
                    { label: 'Tarea', value: 'task' },
                    { label: 'Evento presencial', value: 'on-site' },
                    { label: 'Cuestionario', value: 'questionnaire' },
                  ]}
                  error={!!errors.type}
                  helperText={errors.type && 'Seleccioná un tipo'}
                />
              </View>

              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>
                  A qué sección pertenece dentro de las que tiene creadas
                </Text>
                <SelectField<EventFormData>
                  name="sectionId"
                  control={control}
                  label=""
                  options={sectionOptions}
                  onChangeTransform={(value) => Number(value)}
                  error={!!(errors as any).sectionId}
                  helperText={(errors as any).sectionId?.message}
                />
              </View>

              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Título del evento</Text>
                <Controller
                  name="title"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      mode="flat"
                      style={styles.input}
                      error={!!errors.title}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                    />
                  )}
                />
                {errors.title?.message && (
                  <Text style={styles.errorText}>{errors.title.message}</Text>
                )}
              </View>

              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Descripción</Text>
                <Controller
                  name="description"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      mode="flat"
                      multiline
                      numberOfLines={4}
                      style={[styles.input, styles.textArea]}
                      error={!!(errors as any).description}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                    />
                  )}
                />
                {(errors as any).description?.message && (
                  <Text style={styles.errorText}>
                    {(errors as any).description.message}
                  </Text>
                )}
              </View>

              <View style={styles.dateTimeRow}>
                <View style={styles.dateColumn}>
                  <FormDateInput
                    name="startDateOnly"
                    control={control}
                    label="Fecha de inicio"
                    placeholder="YYYY-MM-DD"
                    error={!!(errors as any).startDateOnly}
                  />
                  {(errors as any).startDateOnly?.message && (
                    <Text style={styles.errorText}>
                      {(errors as any).startDateOnly.message}
                    </Text>
                  )}
                </View>

                <View style={styles.timeColumn}>
                  <Text variant="labelLarge" style={{ marginBottom: 8, marginTop: 8 }}>
                    Hora inicio
                  </Text>
                  <Controller
                    name="startTimeOnly"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="08:00"
                        mode="flat"
                        style={styles.input}
                        error={!!(errors as any).startTimeOnly}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                      />
                    )}
                  />
                  {(errors as any).startTimeOnly?.message && (
                    <Text style={styles.errorText}>
                      {(errors as any).startTimeOnly.message}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.dateTimeRow}>
                <View style={styles.dateColumn}>
                  <FormDateInput
                    name="endDateOnly"
                    control={control}
                    label="Fecha de fin"
                    placeholder="YYYY-MM-DD"
                    error={!!(errors as any).endDateOnly}
                  />
                  {(errors as any).endDateOnly?.message && (
                    <Text style={styles.errorText}>
                      {(errors as any).endDateOnly.message}
                    </Text>
                  )}
                </View>

                <View style={styles.timeColumn}>
                  <Text variant="labelLarge" style={{ marginBottom: 8, marginTop: 8 }}>
                    Hora fin
                  </Text>
                  <Controller
                    name="endTimeOnly"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="23:59"
                        mode="flat"
                        style={styles.input}
                        error={!!(errors as any).endTimeOnly}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                      />
                    )}
                  />
                  {(errors as any).endTimeOnly?.message && (
                    <Text style={styles.errorText}>
                      {(errors as any).endTimeOnly.message}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>
                  Nota máxima que tendrá {
                    selectedEventType === 'task' ? 'la tarea' : 
                    selectedEventType === 'on-site' ? 'el evento' : 
                    'el cuestionario'
                  } al corregirse
                </Text>
                <Controller
                  name="maxGrade"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={String(value)}
                      onChangeText={(text) => onChange(Number(text) || 0)}
                      mode="flat"
                      keyboardType="numeric"
                      style={styles.input}
                      error={!!(errors as any).maxGrade}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                    />
                  )}
                />
                {(errors as any).maxGrade?.message && (
                  <Text style={styles.errorText}>
                    {(errors as any).maxGrade.message}
                  </Text>
                )}
              </View>

              {selectedEventType === 'questionnaire' && (
                <View style={styles.fieldWrapper}>
                  <Text style={styles.label}>Duración en minutos</Text>
                  <Controller
                    name="durationInMinutes"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value ? String(value) : ''}
                        onChangeText={(text) => onChange(text ? Number(text) : undefined)}
                        mode="flat"
                        keyboardType="numeric"
                        style={styles.input}
                        error={!!(errors as any).durationInMinutes}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                      />
                    )}
                  />
                  {(errors as any).durationInMinutes?.message && (
                    <Text style={styles.errorText}>
                      {(errors as any).durationInMinutes.message}
                    </Text>
                  )}
                </View>
              )}

              {selectedEventType === 'questionnaire' && (
                <View style={styles.questionsSection}>
                  <View style={styles.questionsSectionHeader}>
                    <Text style={styles.sectionTitle}>Preguntas</Text>
                  </View>

                  {fields.map((field, questionIndex) => (
                    <View key={field.id}>
                      {questionIndex > 0 && <Divider style={styles.questionDivider} />}

                      <View style={styles.questionContainer}>
                        <View style={styles.fieldWrapper}>
                          <Text style={styles.label}>El texto de la pregunta</Text>
                          <Controller
                            name={`questions.${questionIndex}.text` as any}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <TextInput
                                value={value}
                                onChangeText={onChange}
                                mode="flat"
                                style={styles.input}
                                error={!!(errors as any).questions?.[questionIndex]?.text}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                              />
                            )}
                          />
                          {(errors as any).questions?.[questionIndex]?.text?.message && (
                            <Text style={styles.errorText}>
                              {(errors as any).questions[questionIndex]?.text?.message}
                            </Text>
                          )}
                        </View>

                        <View style={styles.fieldWrapper}>
                          <Text style={styles.label}>
                            Opciones de respuesta (mínimo 2)
                          </Text>
                          {[0, 1, 2, 3].map((answerIndex) => (
                            <View key={answerIndex} style={{ marginTop: answerIndex > 0 ? 8 : 0 }}>
                              <Controller
                                control={control}
                                name={`questions.${questionIndex}.answers.${answerIndex}.text` as any}
                                render={({ field: { onChange, value } }) => (
                                  <TextInput
                                    value={value || ''}
                                    onChangeText={onChange}
                                    placeholder={`Opción ${answerIndex + 1}`}
                                    mode="flat"
                                    style={styles.input}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                  />
                                )}
                              />
                            </View>
                          ))}
                        </View>

                        <View style={styles.fieldWrapper}>
                          <Text style={styles.label}>Respuesta correcta</Text>
                          <SelectField<any>
                            name={`questions.${questionIndex}.correctAnswerIndex` as any}
                            control={control}
                            label=""
                            options={[
                              { label: 'Opción 1', value: '0' },
                              { label: 'Opción 2', value: '1' },
                              { label: 'Opción 3', value: '2' },
                              { label: 'Opción 4', value: '3' },
                            ]}
                            onChangeTransform={(selectedValue) => {
                              const correctIndex = Number(selectedValue);
                              [0, 1, 2, 3].forEach((answerIndex) => {
                                const answerText = watch(
                                  `questions.${questionIndex}.answers.${answerIndex}.text` as any
                                );
                                if (answerText) {
                                  (control as any)._formValues.questions[questionIndex].answers[answerIndex].correct = 
                                    (answerIndex === correctIndex);
                                }
                              });
                              return correctIndex;
                            }}
                            error={!!(errors as any).questions?.[questionIndex]?.answers}
                          />
                          {(errors as any).questions?.[questionIndex]?.answers?.message && (
                            <Text style={styles.errorText}>
                              {(errors as any).questions[questionIndex]?.answers?.message}
                            </Text>
                          )}
                        </View>

                        {fields.length > 1 && (
                          <Button
                            mode="text"
                            onPress={() => remove(questionIndex)}
                            textColor="#666"
                            style={styles.removeButton}
                          >
                            Eliminar pregunta
                          </Button>
                        )}
                      </View>
                    </View>
                  ))}

                  <Button
                    mode="text"
                    onPress={() => append({
                      text: '',
                      answers: [
                        { text: '', correct: false },
                        { text: '', correct: false }
                      ]
                    })}
                    style={styles.addQuestionButton}
                    labelStyle={styles.addQuestionLabel}
                  >
                    + Añadir otra pregunta
                  </Button>
                </View>
              )}
            </View>
          </ScrollView>
        </Dialog.Content>

        <Dialog.Actions style={styles.actions}>
          <Button
            onPress={onClose}
            textColor="#666"
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            loading={isPending}
            onPress={handleSubmit(handleFormSubmit)}
            buttonColor="#2196F3"
            style={styles.submitButton}
          >
            {selectedEventType === 'questionnaire' ? 'Crear cuestionario' : 'Crear evento'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: 480,
    maxWidth: '95%',
    maxHeight: '90%',
    borderRadius: 8,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    maxHeight: 500,
  },
  formContainer: {
    gap: 16,
    paddingBottom: 16,
  },
  fieldWrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#F5F5F5',
    fontSize: 14,
    height: 44,
  },
  textArea: {
    height: 80,
    paddingTop: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateColumn: {
    flex: 2,
  },
  timeColumn: {
    flex: 1,
    paddingTop: 0,
  },
  errorText: {
    color: THEME.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  questionsSection: {
    marginTop: 4,
  },
  questionsSectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  questionContainer: {
    paddingVertical: 12,
  },
  questionDivider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: 8,
  },
  removeButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  addQuestionButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  addQuestionLabel: {
    color: '#2196F3',
    fontSize: 14,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    marginRight: 8,
  },
  submitButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
  },
});