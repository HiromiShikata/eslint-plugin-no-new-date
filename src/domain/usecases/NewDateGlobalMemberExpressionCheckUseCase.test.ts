import { isGlobalDateMemberExpression } from './NewDateGlobalMemberExpressionCheckUseCase';

describe('NewDateGlobalMemberExpressionCheckUseCase', () => {
  test('returns true for globalThis.Date', () => {
    expect(isGlobalDateMemberExpression('globalThis', 'Date')).toBe(true);
  });

  test('returns true for window.Date', () => {
    expect(isGlobalDateMemberExpression('window', 'Date')).toBe(true);
  });

  test('returns false for non-global-Date objects', () => {
    expect(isGlobalDateMemberExpression('foo', 'Date')).toBe(false);
    expect(isGlobalDateMemberExpression('myLib', 'Date')).toBe(false);
  });

  test('returns false for non-Date properties', () => {
    expect(isGlobalDateMemberExpression('globalThis', 'Math')).toBe(false);
    expect(isGlobalDateMemberExpression('window', 'date')).toBe(false);
    expect(isGlobalDateMemberExpression('globalThis', '')).toBe(false);
  });
});
