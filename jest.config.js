module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  collectCoverageFrom: [
    'src/utils/**/*.{ts,tsx}',
    'src/store/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/components/**',
    '!src/screens/**',
  ],
};
