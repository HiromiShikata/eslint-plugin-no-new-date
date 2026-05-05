import { rules } from './index';

describe('eslint-plugin-no-new-date', () => {
  test('exports no-new-date rule', () => {
    expect(rules['no-new-date']).toBeDefined();
    expect(typeof rules['no-new-date'].create).toBe('function');
  });
});
