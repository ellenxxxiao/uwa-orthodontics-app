//clerktest testing
import { server } from '../server';

describe('ClerkTest API', () => {
  it('should return a clerk test response', async () => {
    const response = await server.get('/api/clerktest');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('testPassed', true);
  });
});
