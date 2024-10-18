//chat test
import { server } from '../server'; 
describe('Chat API', () => {
  it('should return a list of chats', async () => {
    const response = await server.get('/api/chat');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should create a new chat', async () => {
    const newChat = { userId: '123', message: 'Hello World' };
    const response = await server.post('/api/chat', newChat);
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
  });

  it('should delete a chat', async () => {
    const response = await server.delete('/api/chat/1'); 
    expect(response.status).toBe(200);
  });
});
