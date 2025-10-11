
// Vitest setup file for DOM-based tests.
// Add global test utilities or mocks here as needed.

import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

