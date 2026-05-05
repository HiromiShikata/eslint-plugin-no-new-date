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
        const scope = context.sourceCode.getScope(node);

        if (callee.type === 'Identifier') {
          if (
            isDateConstructorName(callee.name) &&
            !isUserDefinedInScopeChain(callee.name, scope)
          ) {
            context.report({ node, messageId: 'noNewDate' });
          }
        } else if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier'
        ) {
          const objectName = callee.object.name;
          const prop = callee.property;
          const propertyName =
            !callee.computed && prop.type === 'Identifier'
              ? prop.name
              : callee.computed &&
                  prop.type === 'Literal' &&
                  typeof prop.value === 'string'
                ? prop.value
                : null;

          if (
            propertyName !== null &&
            isGlobalDateMemberExpression(objectName, propertyName) &&
            !isUserDefinedInScopeChain(objectName, scope)
          ) {
            context.report({ node, messageId: 'noNewDate' });
          }
        }
      },
    };
  },
};

export default noNewDate;
