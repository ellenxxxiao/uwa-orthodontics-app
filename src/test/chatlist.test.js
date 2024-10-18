//chatlist test
import { server } from '../server';

describe('Chat List API', () => {
  it('should return a list of chat rooms', async () => {
    const response = await server.get('/api/chat-list');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
