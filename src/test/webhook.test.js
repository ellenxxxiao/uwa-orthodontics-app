//webhook test
import { server } from '../server';

describe('Webhook API', () => {
  it('should handle webhook events', async () => {
    const webhookPayload = { event: 'reminder_created', data: { id: 1 } };
    const response = await server.post('/api/webhook', webhookPayload);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('success', true);
  });
});
