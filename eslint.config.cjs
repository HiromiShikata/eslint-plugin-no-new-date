const fs = require('fs');
const babelParser = require('@babel/eslint-parser');
const importPlugin = require('eslint-plugin-import-x');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');

const gitignorePatterns = fs
  .readFileSync('.gitignore', 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

module.exports = [
  { ignores: gitignorePatterns },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-typescript'],
          parserOpts: {
            plugins: ['typescript'],
          },
        },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      'import-x': importPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    settings: {
      'import-x/extensions': ['.ts', '.tsx', '.js', '.jsx'],
      'import-x/resolver': { typescript: true },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/domain',
              from: './src/adapter',
            },
            {
              target: './src/domain/entities',
              from: './src/domain/usecases',
            },
            {
              target: './src/adapter/repositories',
              from: './src/adapter/entry-points',
            },
          ],
        },
      ],
      'unused-imports/no-unused-imports': 'error',
    },
  },
];
