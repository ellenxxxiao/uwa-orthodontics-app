//reminder test
import { server } from '../server';

describe('Reminder API', () => {
  it('should return a list of reminders', async () => {
    const response = await server.get('/api/reminder');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should create a new reminder', async () => {
    const newReminder = {
      description: 'Doctor Appointment',
      startDate: '2024-12-01T10:00:00',
      repeatType: 'WEEKLY'
    };
    const response = await server.post('/api/reminder', newReminder);
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
  });

  it('should delete a reminder', async () => {
    const response = await server.delete('/api/reminder/1');
    expect(response.status).toBe(200);
  });
});
