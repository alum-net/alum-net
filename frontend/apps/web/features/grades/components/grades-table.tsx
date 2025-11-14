import React from 'react';
import { DataTable } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { FormTextInput } from '@alum-net/ui';
import { StudentGrade } from '../types';
import { Submission, ViewSubmissionButton } from '@alum-net/courses';

type Props = {
  students: StudentGrade[];
  onGradeChange: (email: string, grade: string) => void;
  maxGrade: number;
  submissions?: Submission[];
  showSubmissionsColumn?: boolean;
};

const GradesTable = ({
  students,
  onGradeChange,
  maxGrade,
  submissions,
  showSubmissionsColumn = false,
}: Props) => {
  const { control } = useForm();

  const getSubmissionForStudent = (email: string): Submission | undefined => {
    return submissions?.find(sub => sub.studentEmail === email);
  };

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Nombre</DataTable.Title>
        <DataTable.Title>Apellido</DataTable.Title>
        <DataTable.Title>Email</DataTable.Title>
        {showSubmissionsColumn && (
          <DataTable.Title>Tarea</DataTable.Title>
        )}
        <DataTable.Title>Nota (0 - {maxGrade})</DataTable.Title>
      </DataTable.Header>

      {students.map((student, index) => {
        const submission = getSubmissionForStudent(student.email);
        return (
          <DataTable.Row key={student.email}>
            <DataTable.Cell>{student.name}</DataTable.Cell>
            <DataTable.Cell>{student.lastname}</DataTable.Cell>
            <DataTable.Cell>{student.email}</DataTable.Cell>
            {showSubmissionsColumn && (
              <DataTable.Cell>
                <ViewSubmissionButton submission={submission} />
              </DataTable.Cell>
            )}
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
        );
      })}
    </DataTable>
  );
};

export default GradesTable;
