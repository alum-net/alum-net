import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { useGrades } from '../hooks/useGrades';
import { StudentSummary } from '../types';
import FinalGradesTable from '../components/final-grades-table';
import { Toast } from '@alum-net/ui';
import { validateAllGrades } from '../validations';

type Props = {
  courseId: string;
};

const roundCalculatedGrade = (calculatedGrade: number | undefined) =>
  calculatedGrade ? Math.floor(calculatedGrade * 100) : 0;

const FinalGradesScreen = ({ courseId }: Props) => {
  const {
    students,
    isLoadingStudents,
    getCalculatedGrades,
    autoGrades,
    saveGrades,
    isSavingGrades,
    getCourseStudents,
    fetchingCalculatedGrades,
  } = useGrades(courseId);
  const isCourseClosed = useMemo(
    () => students?.data?.every(student => Boolean(student.finalGrade)),
    [students],
  );
  const [grades, setGrades] = useState<StudentSummary[]>([]);

  const handleGradeChange = (email: string, grade: string) => {
    const newGrades = grades.map(student =>
      student.email === email
        ? { ...student, calculatedGrade: parseInt(grade) }
        : student,
    );
    setGrades(newGrades);
  };

  const handleSaveChanges = () => {
    if (
      !validateAllGrades(
        grades.map(g => ({ ...g, grade: g.calculatedGrade ?? null })),
      )
    ) {
      Toast.error(
        'Hay notas inválidas. Por favor, revise las notas ingresadas.',
      );
      return;
    }
    saveGrades(
      {
        students: grades.map(s => ({
          name: s.name,
          lastname: s.lastname,
          email: s.email,
          grade: s.calculatedGrade ?? null,
        })),
        courseId: courseId,
      },
      {
        onSuccess: () => {
          Toast.success('Notas guardadas correctamente');
          getCourseStudents();
        },
        onError: () => {
          Toast.error('Error al guardar las notas');
        },
      },
    );
  };

  const handleAutoCalculate = () => {
    getCalculatedGrades();
  };

  const handleCsvUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const fileString = await fetch(fileUri).then(res => res.text());

      const rows = fileString.split('\n').filter(row => row.trim() !== '');
      const header = rows[0].split(',').map(h => h.trim());
      const emailIndex = header.indexOf('email');
      const gradeIndex = header.indexOf('nota');

      if (emailIndex === -1 || gradeIndex === -1) {
        Toast.error('El archivo CSV debe tener las columnas "email" y "nota".');
        return;
      }
      let hasError = false;
      const csvGrades = rows.slice(1).map(row => {
        const values = row.split(',');
        return {
          email: values[emailIndex]?.trim(),
          grade: values[gradeIndex]?.trim(),
        };
      });

      const newGrades = grades.map(student => {
        const csvGrade = csvGrades.find(g => g.email === student.email);
        if (csvGrade && csvGrade.grade) {
          const newGrade = parseInt(csvGrade.grade, 10);
          if (!isNaN(newGrade)) {
            return { ...student, calculatedGrade: newGrade };
          }
        } else {
          hasError = true;
        }
        return student;
      });

      setGrades(newGrades);
      Toast.success(
        `Archivo CSV procesado correctamente.${hasError ? ' Hubo algunos estudiantes que no fueron indicados correctamente.' : ''}`,
      );
    } catch (error) {
      Toast.error('Error al procesar el archivo CSV.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (students) {
      setGrades(students.data ?? []);
    }
  }, [students]);

  useEffect(() => {
    if (autoGrades && autoGrades.data) {
      setGrades(
        autoGrades.data.map(grade => ({
          ...grade,
          calculatedGrade: roundCalculatedGrade(grade.calculatedGrade),
        })),
      );
    }
  }, [autoGrades]);

  useEffect(() => {
    getCourseStudents();
  }, [getCourseStudents]);

  return (
    <View style={{ gap: 20 }}>
      <Text variant="headlineSmall">Calificaciones Finales</Text>
      {!isCourseClosed && (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            onPress={handleAutoCalculate}
            loading={fetchingCalculatedGrades}
            disabled={isSavingGrades || !!autoGrades}
          >
            Calcular Notas Automaticamente
          </Button>
          <Button
            icon="upload"
            onPress={handleCsvUpload}
            disabled={fetchingCalculatedGrades || isSavingGrades}
          >
            Subir Archivo CSV
          </Button>
        </View>
      )}
      {isLoadingStudents ? (
        <ActivityIndicator />
      ) : (
        <>
          <FinalGradesTable
            students={grades}
            onGradeChange={handleGradeChange}
          />
          {!isCourseClosed && (
            <Button
              mode="contained"
              onPress={handleSaveChanges}
              disabled={isSavingGrades || fetchingCalculatedGrades}
              loading={isSavingGrades}
            >
              Guardar y publicar resultados
            </Button>
          )}
        </>
      )}
    </View>
  );
};

export default FinalGradesScreen;
