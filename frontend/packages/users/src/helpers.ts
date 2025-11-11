import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { AgendaEvent, AgendaItem, CalendarEvent } from './types';

export function mapEventsToAgendaItems(data: CalendarEvent[]) {
  if (!data) return [];

  const groupedByDate: Record<string, AgendaEvent[]> = {};

  data.forEach(event => {
    const start = new Date(event.startDate);
    const dateKey = start.toISOString().split('T')[0];

    const hour = start
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
      })
      .toLowerCase();

    const agendaEvent = {
      hour,
      duration: '1h',
      title: event.title || event.description,
      eventData: { ...event },
    };

    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(agendaEvent);
  });

  const agendaItems: AgendaItem[] = Object.entries(groupedByDate).map(
    ([date, events]) => ({
      title: date,
      data: events,
    }),
  );

  agendaItems.sort(
    (a, b) => new Date(a.title).getTime() - new Date(b.title).getTime(),
  );

  return agendaItems;
}

export function getMarkedDates(agendaItems: AgendaItem[]) {
  const marked: MarkedDates = {};

  agendaItems.forEach(item => {
    if (item.data && item.data.length > 0 && item.data[0]) {
      marked[item.title] = { marked: true };
    } else {
      marked[item.title] = { disabled: true };
    }
  });
  return marked;
}

export function mapDateToString(date: DateData) {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  if (date.month < 1 || date.month > 12) {
    throw new Error('Month number must be between 1 and 12');
  }

  return `${date.year} - ${months[date.month - 1]}`;
}
