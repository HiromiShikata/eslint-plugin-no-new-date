export const isGlobalDateMemberExpression = (
  objectName: string,
  propertyName: string,
): boolean =>
  (objectName === 'globalThis' || objectName === 'window') &&
  propertyName === 'Date';
