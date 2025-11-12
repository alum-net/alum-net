import { useQuery } from '@tanstack/react-query';
import { getUserCalendar } from '../service';
import { ActivityIndicator, Text } from 'react-native-paper';
import {
  AgendaList,
  CalendarProvider,
  DateData,
  WeekCalendar,
} from 'react-native-calendars';
import {
  getMarkedDates,
  mapEventsToAgendaItems,
  mapDateToString,
} from '../helpers';
import AgendaItem from './agenda-item';
import { useEffect, useMemo, useState } from 'react';
import { QUERY_KEYS } from '@alum-net/api';
import { View } from 'react-native';

const today = new Date();
const todayDateData: DateData = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate(),
  timestamp: 1761868800000,
  dateString: today.toDateString(),
};

export const Calendar = ({ width }: { width: number }) => {
  const [activeDate, setActiveDate] = useState<DateData>(todayDateData);
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.getUserCalendar],
    queryFn: getUserCalendar,
  });
  const dates = useMemo(
    () => (data?.data ? mapEventsToAgendaItems(data.data) : []),
    [data],
  );
  const [markedDates, setMarkedDates] = useState(
    getMarkedDates(mapEventsToAgendaItems(data?.data ?? [])),
  );
  useEffect(() => {
    setMarkedDates(getMarkedDates(mapEventsToAgendaItems(data?.data ?? [])));
  }, [data]);

  return (
    <CalendarProvider
      date={`${todayDateData.year}-${todayDateData.month}-${todayDateData.day}`}
      showTodayButton
      onMonthChange={date => setActiveDate(date)}
    >
      <Text
        variant="bodyLarge"
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 50,
          paddingVertical: 10,
        }}
      >
        {mapDateToString(activeDate)}
      </Text>
      <WeekCalendar
        scrollEnabled
        firstDay={1}
        markedDates={markedDates}
        calendarWidth={width}
        key={width}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <AgendaList
          markToday
          sections={dates}
          renderItem={({ item }) => <AgendaItem item={item} />}
          ListEmptyComponent={
            <Text variant="titleLarge" style={{ padding: 20 }}>
              No hay eventos para mostrar
            </Text>
          }
        />
      )}
    </CalendarProvider>
  );
};
