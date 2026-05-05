import { RuleTester } from 'eslint';
import noNewDate from './no-new-date';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-new-date', noNewDate, {
  valid: [
    { code: 'const d = Date.now();' },
    { code: 'const d = Date.parse("2024-01-01");' },
    { code: 'const d = new MyDate();' },
    { code: 'const d = new DateTime();' },
  ],
  invalid: [
    {
      code: 'const d = new Date();',
      errors: [{ messageId: 'noNewDate' }],
    },
    {
      code: 'const d = new Date("2024-01-01");',
      errors: [{ messageId: 'noNewDate' }],
    },
    {
      code: 'const d = new Date(2024, 0, 1);',
      errors: [{ messageId: 'noNewDate' }],
    },
    {
      code: 'const d = new Date(Date.now());',
      errors: [{ messageId: 'noNewDate' }],
    },
  ],
});
