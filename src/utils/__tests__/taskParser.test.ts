import { parseTask } from '../taskParser';

describe('taskParser', () => {
  beforeEach(() => {
    // Фиксируем дату для стабильности тестов
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-11-13T10:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Парсинг даты', () => {
    it('должен распознавать "завтра"', () => {
      const task = parseTask('созвон завтра');
      expect(task.date).toBe('2025-11-14');
      expect(task.title).toBe('созвон');
    });

    it('должен распознавать "через N дней"', () => {
      const task = parseTask('встреча через 3 дня');
      expect(task.date).toBe('2025-11-16');
      expect(task.title).toBe('встреча');
    });

    it('должен распознавать дни недели', () => {
      const task = parseTask('тренировка в понедельник');
      // Следующий понедельник после 13 ноября 2025 (четверг) - это 17 ноября
      expect(task.date).toBe('2025-11-17');
    });

    it('должен возвращать сегодняшнюю дату если дата не указана', () => {
      const task = parseTask('просто задача');
      expect(task.date).toBe('2025-11-13');
    });
  });

  describe('Парсинг времени', () => {
    it('должен распознавать время в формате "в 10"', () => {
      const task = parseTask('созвон в 10');
      expect(task.time).toBe('10:00');
    });

    it('должен распознавать время в формате "в 14:30"', () => {
      const task = parseTask('встреча в 14:30');
      expect(task.time).toBe('14:30');
    });

    it('должен распознавать "утро"', () => {
      const task = parseTask('пробежка утром');
      expect(task.time).toBe('09:00');
    });

    it('должен распознавать "вечер"', () => {
      const task = parseTask('ужин вечером');
      expect(task.time).toBe('18:00');
    });

    it('должен распознавать "полдень"', () => {
      const task = parseTask('обед в полдень');
      expect(task.time).toBe('12:00');
    });

    it('должен возвращать текущее время если время не указано', () => {
      const task = parseTask('просто задача');
      expect(task.time).toBe('10:00'); // Фиксированное время в тесте
    });

    it('должен форматировать время с ведущими нулями', () => {
      const task = parseTask('встреча в 9');
      expect(task.time).toBe('09:00'); // Должно быть 09:00, а не 9:00
    });

    it('должен форматировать минуты с ведущими нулями', () => {
      const task = parseTask('созвон в 9:05');
      expect(task.time).toBe('09:05');
    });
  });

  describe('Парсинг длительности', () => {
    it('должен распознавать длительность в часах', () => {
      const task = parseTask('встреча на 2 часа');
      expect(task.duration).toBe(120); // 2 * 60 минут
    });

    it('должен распознавать длительность в минутах', () => {
      const task = parseTask('звонок на 30 минут');
      expect(task.duration).toBe(30);
    });

    it('должен вернуть 0 если длительность не указана', () => {
      const task = parseTask('просто задача');
      expect(task.duration).toBe(0);
    });
  });

  describe('Парсинг приоритета', () => {
    it('должен распознавать высокий приоритет "!!!"', () => {
      const task = parseTask('срочная задача !!!');
      expect(task.priority).toBe('high');
    });

    it('должен распознавать высокий приоритет "срочно"', () => {
      const task = parseTask('срочно позвонить');
      expect(task.priority).toBe('high');
    });

    it('должен распознавать средний приоритет "важно"', () => {
      const task = parseTask('важно подготовить отчет');
      expect(task.priority).toBe('medium');
    });

    it('должен устанавливать нормальный приоритет по умолчанию', () => {
      const task = parseTask('обычная задача');
      expect(task.priority).toBe('normal');
    });
  });

  describe('Комплексные сценарии', () => {
    it('должен парсить задачу со всеми параметрами', () => {
      const task = parseTask('созвон с клиентом завтра в 14:30 на 1 час !!!');
      expect(task.date).toBe('2025-11-14');
      expect(task.time).toBe('14:30');
      expect(task.duration).toBe(60);
      expect(task.priority).toBe('high');
      expect(task.title).toContain('созвон с клиентом');
    });

    it('должен корректно очищать заголовок от служебных слов', () => {
      const task = parseTask('созвон завтра в 10 важно на 30 минут');
      // Заголовок должен остаться без "завтра", "в 10", "важно", "на 30 минут"
      expect(task.title).toBe('созвон');
    });

    it('должен генерировать уникальный ID', () => {
      const task1 = parseTask('задача 1');
      // Сдвигаем время на 1мс для уникальности ID
      jest.advanceTimersByTime(1);
      const task2 = parseTask('задача 2');
      expect(task1.id).not.toBe(task2.id);
    });

    it('должен устанавливать пустую категорию по умолчанию', () => {
      const task = parseTask('задача');
      expect(task.category).toBe('');
    });
  });

  describe('Обработка граничных случаев', () => {
    it('должен обрабатывать пустой ввод', () => {
      const task = parseTask('');
      expect(task.title).toBe('');
      expect(task.date).toBe('2025-11-13');
      expect(task.time).toBe('10:00');
    });

    it('должен обрабатывать только пробелы', () => {
      const task = parseTask('   ');
      expect(task.title.trim()).toBe('');
    });

    it('должен обрабатывать специальные символы в заголовке', () => {
      const task = parseTask('задача #1 @ офис');
      expect(task.title).toContain('#1');
      expect(task.title).toContain('@');
    });

    it('должен обрабатывать регистр', () => {
      const task1 = parseTask('ЗАВТРА');
      const task2 = parseTask('завтра');
      expect(task1.date).toBe(task2.date);
    });
  });
});
