//user test
import { server } from '../server';

describe('Users API', () => {
  it('should return a list of users', async () => {
    const response = await server.get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should create a new user', async () => {
    const newUser = { name: 'Jane Doe', email: 'jane.doe@example.com' };
    const response = await server.post('/api/users', newUser);
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
  });
});
