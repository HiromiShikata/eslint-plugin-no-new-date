import type { Rule } from 'eslint';
import noNewDateRule from './adapter/entry-points/eslint-rule/no-new-date';

export const rules: Record<string, Rule.RuleModule> = {
  'no-new-date': noNewDateRule,
};
