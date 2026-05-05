import type { Rule } from 'eslint';
import { isDateConstructorName } from '../../../domain/usecases/NewDateCalleeNameCheckUseCase';

const noNewDate: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the use of new Date()',
      recommended: true,
    },
    messages: {
      noNewDate:
        'Avoid using new Date(). Use a timezone-aware date utility instead.',
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      NewExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          isDateConstructorName(node.callee.name)
        ) {
          context.report({
            node,
            messageId: 'noNewDate',
          });
        }
      },
    };
  },
};

export default noNewDate;
