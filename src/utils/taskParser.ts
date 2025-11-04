import { Task } from '../store/tasksStore';

const weekdays = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среду',
  'четверг',
  'пятницу',
  'субботу',
];

// форматирование даты 
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseTask = (input: string): Task => {
  const id = Date.now().toString();

  let title = input;
  let date = '—';
  let time = '—';
  let duration = 0;
  let priority: 'low' | 'normal' | 'medium' | 'high' = 'normal';

  const now = new Date();

  //  дата
  if (/завтра/i.test(input)) {
    const d = new Date(now);
    d.setDate(now.getDate() + 1);
    date = formatDate(d);
    title = title.replace(/завтра/gi, '');
  } else if (/через\s+(\d+)\s+д(ня|ней)/i.test(input)) {
    const match = input.match(/через\s+(\d+)\s+д(ня|ней)/i);
    if (match) {
      const d = new Date(now);
      d.setDate(now.getDate() + parseInt(match[1]));
      date = formatDate(d);
      title = title.replace(match[0], '');
    }
  } else if (
    /\d{1,2}\s+(январ|феврал|март|апрел|ма|июн|июл|август|сентябр|октябр|ноябр|декабр)/i.test(
      input
    )
  ) {
    const match = input.match(/(\d{1,2})\s+([а-я]+)/i);
    if (match) date = `${match[1]} ${match[2]}`;
  } else {
    for (let i = 0; i < weekdays.length; i++) {
      if (input.toLowerCase().includes(weekdays[i])) {
        const d = new Date(now);
        const delta = (i + 7 - now.getDay()) % 7;
        d.setDate(now.getDate() + delta);
        date = formatDate(d);
        break;
      }
    }
  }

  // время
  const timeMatch = input.match(/в\s*(\d{1,2})([:\s]?\d{2})?/i);
  if (timeMatch) {
    const hours = timeMatch[1].padStart(2, '0');
    const minutes = timeMatch[2]
      ? timeMatch[2].replace(':', '').trim().padStart(2, '0')
      : '00';
    time = `${hours}:${minutes}`;
  } else if (/вечер/i.test(input)) time = '18:00';
  else if (/утро/i.test(input)) time = '09:00';
  else if (/полдень/i.test(input)) time = '12:00';

  // приоритет
  if (input.includes('!!!') || /срочно/i.test(input)) priority = 'high';
  else if (/важно/i.test(input)) priority = 'medium';

  // очистка заголовка
  title = title
    .replace(
      /(завтра|через\s+\d+\s+д(ня|ней)|в\s+\d{1,2}(:\d{2})?|!!!|важно|срочно|на\s+\d+\s+(час|минут)[ы]?)/gi,
      ''
    )
    .trim();

  // Если дата не распознана, ставим сегодня
  if (date === '—') {
    date = formatDate(now);
  }

  // Если время не указано, ставим текущее время
  if (time === '—') {
    time = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  return { id, title, date, time, duration, priority, category: '' };
};
