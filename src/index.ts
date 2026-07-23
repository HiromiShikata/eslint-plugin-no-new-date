import noNewDateRule from './adapter/entry-points/eslint-rule/no-new-date';

export const rules: Record<string, import('eslint').Rule.RuleModule> = {
  'no-new-date': noNewDateRule,
};
