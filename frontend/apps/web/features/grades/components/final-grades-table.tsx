import React, { useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import { StudentSummary } from '../types';
import { Controller, useForm } from 'react-hook-form';
import { FormTextInput } from '@alum-net/ui';

type Props = {
  students: StudentSummary[];
  onGradeChange: (email: string, grade: string) => void;
};

const FinalGradesTable = ({ students, onGradeChange }: Props) => {
  const { control, setValue } = useForm();

  useEffect(() => {
    if (students.some(student => Boolean(student.calculatedGrade))) {
      students.forEach((student, index) => {
        setValue(`grades[${index}].grade`, student.calculatedGrade);
      });
    }
  }, [students, setValue]);

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Nombre</DataTable.Title>
        <DataTable.Title>Apellido</DataTable.Title>
        <DataTable.Title>Email</DataTable.Title>
        <DataTable.Title>Nota (0 - 100)</DataTable.Title>
      </DataTable.Header>

      {students.map((student, index) => (
        <DataTable.Row key={student.email}>
          <DataTable.Cell>{student.name}</DataTable.Cell>
          <DataTable.Cell>{student.lastname}</DataTable.Cell>
          <DataTable.Cell>{student.email}</DataTable.Cell>
          <DataTable.Cell>
            {!student.finalGrade === undefined ? (
              <Controller
                control={control}
                name={`grades[${index}].grade`}
                render={() => (
                  <FormTextInput
                    name={`grades[${index}].grade`}
                    control={control}
                    mode="outlined"
                    keyboardType="numeric"
                    maxLength={3}
                    style={{
                      maxHeight: '70%',
                      maxWidth: '50%',
                      justifyContent: 'center',
                    }}
                    customOnChange={(val: string, fieldOnChange) => {
                      const numericValue = val.replace(/[^0-9]/g, '');
                      if (Number(numericValue) <= 100) {
                        fieldOnChange(numericValue);
                        onGradeChange(student.email, numericValue);
                      }
                    }}
                  />
                )}
              />
            ) : (
              student.finalGrade
            )}
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
};

export default FinalGradesTable;
