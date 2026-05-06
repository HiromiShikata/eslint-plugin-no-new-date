import { isDateConstructorName } from './NewDateCalleeNameCheckUseCase';

describe('NewDateCalleeNameCheckUseCase', () => {
  test('returns true for Date', () => {
    expect(isDateConstructorName('Date')).toBe(true);
  });

  test('returns false for other constructor names', () => {
    expect(isDateConstructorName('DateTime')).toBe(false);
    expect(isDateConstructorName('MyDate')).toBe(false);
    expect(isDateConstructorName('date')).toBe(false);
    expect(isDateConstructorName('')).toBe(false);
  });
});
