import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [users, setUsers] = useState([]);
  const senderId = "dc428694-40e8-4ee1-9d2f-f7a8ea8aeec6";

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (receiverId) {
      fetchMessages();
    }
  }, [receiverId]);

  const fetchMessages = async () => {
    if (!receiverId) {
      console.log("Receiver ID not selected");
      setMessages([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('Message')
        .select(`
          text,
          sentAt,
          status,
          sender:User!senderId (id, firstName, lastName),
          receiver:User!receiverId (id, firstName, lastName)
        `)
        .match({ senderId: senderId, receiverId: receiverId }) // Filter messages between sender and selected receiver
        .order('sentAt', { ascending: false });
  
      if (error) {
        console.error('Error fetching messages:', error.message);
        throw error;
      }
  
      if (data) {
        console.log("Fetched messages:", data);
        setMessages(data);
      } else {
        console.log("No data returned from the query");
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('id, firstName, lastName')
        .not('id', 'eq', senderId);

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !receiverId) {
      console.log("Invalid input or receiver ID not selected.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Message')
        .insert([{
          senderId, 
          receiverId, 
          text: input, 
          sentAt: new Date(), 
          status: 'SENT'
        }]);

      if (error) {
        console.error('Error inserting message:', error.message);
        return;
      }

      console.log("Message sent successfully:", data);
      setInput('');
      fetchMessages();  // Refresh messages to show the new one
    } catch (error) {
      console.error('Error inserting message:', error.message);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">MVP Chat App!</h1>
      <div className="card p-4 shadow-sm">
        <ul className="list-unstyled">
          {messages.map((message) => (
            <li key={message.id} className="border-bottom py-2">
              <strong>From:</strong> {message.sender.firstName} {message.sender.lastName} <br/>
              <strong>To:</strong> {message.receiver.firstName} {message.receiver.lastName}<br/>
              <strong>Message:</strong> {message.text}<br/>
              <small>Sent at: {new Date(message.sentAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="d-flex mt-3">
          <select 
            className="form-control me-2"
            value={receiverId}
            onChange={e => setReceiverId(e.target.value)}
          >
            <option value="">Select Receiver</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
          <input
  type="text"
  className="form-control me-2"
  placeholder="Type your message here..."
  value={input}
  onChange={e => setInput(e.target.value)}  // Corrected this line
/>
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
