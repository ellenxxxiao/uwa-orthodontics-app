//contact test
import { server } from '../server';

describe('Contacts API', () => {
  it('should return a list of contacts', async () => {
    const response = await server.get('/api/contacts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should create a new contact', async () => {
    const newContact = { name: 'John Doe', email: 'john.doe@example.com' };
    const response = await server.post('/api/contacts', newContact);
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
  });

  it('should delete a contact', async () => {
    const response = await server.delete('/api/contacts/1');
    expect(response.status).toBe(200);
  });
});
