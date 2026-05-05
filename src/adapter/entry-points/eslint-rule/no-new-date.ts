import type { Rule, Scope } from 'eslint';
import { isDateConstructorName } from '../../../domain/usecases/NewDateCalleeNameCheckUseCase';
import { isGlobalDateMemberExpression } from '../../../domain/usecases/NewDateGlobalMemberExpressionCheckUseCase';

const isUserDefinedInScopeChain = (
  name: string,
  scope: Scope.Scope,
): boolean => {
  let currentScope: Scope.Scope | null = scope;
  while (currentScope !== null) {
    const variable = currentScope.variables.find((v) => v.name === name);
    if (variable !== undefined) {
      return variable.defs.length > 0;
    }
    currentScope = currentScope.upper;
  }
  return false;
};

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
        const { callee } = node;
        if (callee.type === 'Identifier') {
          if (
            isDateConstructorName(callee.name) &&
            !isUserDefinedInScopeChain('Date', context.getScope())
          ) {
            context.report({ node, messageId: 'noNewDate' });
          }
        } else if (
          callee.type === 'MemberExpression' &&
          !callee.computed &&
          callee.object.type === 'Identifier' &&
          callee.property.type === 'Identifier' &&
          isGlobalDateMemberExpression(
            callee.object.name,
            callee.property.name,
          ) &&
          !isUserDefinedInScopeChain(callee.object.name, context.getScope())
        ) {
          context.report({ node, messageId: 'noNewDate' });
        }
      },
    };
  },
};

export default noNewDate;
