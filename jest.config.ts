import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Use 'node' for backend-only tests
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': 'src/$1', // Adjust for alias paths like "@/components"
  },
//   setupFilesAfterEnv: ['jest.setup.ts'], // Optional, for global setup
  testPathIgnorePatterns: ['.next/', 'node_modules/'], // Ignore build files
};

export default config;
