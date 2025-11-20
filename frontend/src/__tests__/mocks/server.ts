import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW test server instance that intercepts and mocks network requests during tests.
 *
 * This server is configured with mock handlers for API endpoints, allowing tests to run
 * without requiring a live backend server. It intercepts HTTP requests made by the application
 * and returns deterministic mock responses.
 *
 * @example
 * // In test setup file (src/__tests__/setup.ts):
 * import { server } from './mocks/server';
 *
 * beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 *
 * @note The server uses handlers from './handlers' which mock POST /api/translate,
 * GET /api/translations, and GET /api/tones endpoints. Handlers are reset after each
 * test to ensure test isolation. The server lifecycle spans all tests in the test suite.
 */
export const server = setupServer(...handlers);



