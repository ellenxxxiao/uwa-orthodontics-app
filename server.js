// Import necessary modules using ES module syntax
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize dotenv to use environment variables
dotenv.config();

// Create a new PrismaClient instance
const prisma = new PrismaClient();

// Initialize Express
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS middleware to allow requests from your React application
app.use(cors({
  origin: ['http://localhost:5173']  // Adjust this depending on your React app's URL
}));

// Route to get messages between two users
app.get('/messages/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      },
      include: {
        Sender: true,  // Assumes you have relations setup in Prisma schema
        Receiver: true
      },
      orderBy: {
        sentAt: 'asc'
      }
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to post a new message
app.post('/messages', async (req, res) => {
  const { senderId, receiverId, text } = req.body;
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
        status: 'SENT'  // Default status; adjust as necessary
      }
    });
    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
