import React from 'react';
import { DataTable } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { FormTextInput } from '@alum-net/ui';
import { StudentGrade } from '../types';

type Props = {
  students: StudentGrade[];
  onGradeChange: (email: string, grade: string) => void;
  maxGrade: number;
};

const GradesTable = ({ students, onGradeChange, maxGrade }: Props) => {
  const { control } = useForm();

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Nombre</DataTable.Title>
        <DataTable.Title>Apellido</DataTable.Title>
        <DataTable.Title>Email</DataTable.Title>
        <DataTable.Title>Nota (0 - {maxGrade})</DataTable.Title>
      </DataTable.Header>

      {students.map((student, index) => (
        <DataTable.Row key={student.email}>
          <DataTable.Cell>{student.name}</DataTable.Cell>
          <DataTable.Cell>{student.lastname}</DataTable.Cell>
          <DataTable.Cell>{student.email}</DataTable.Cell>
          <DataTable.Cell>
            <Controller
              control={control}
              name={`grades[${index}].grade`}
              defaultValue={student.grade?.toString() ?? ''}
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
                    if (Number(numericValue) <= maxGrade) {
                      fieldOnChange(numericValue);
                      onGradeChange(student.email, numericValue);
                    }
                  }}
                />
              )}
            />
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
};

export default GradesTable;
