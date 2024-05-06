import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');  // State to hold the input text

  useEffect(() => {
    // Fetch initial data
    fetchMessages();

}, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;  // Prevent sending empty messages

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ text: input }]);

      if (error) throw error;
      setInput('');  // Clear input field after successful submission
      fetchMessages();  // Re-fetch messages to show the new one
    } catch (error) {
      console.error('Error inserting message:', error.message);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Llama Message Service</h1>
      <div className="card p-4 shadow-sm">
        <ul className="list-unstyled">
          {messages.map((message, index) => (
            <li key={index} className="border-bottom py-2">{message.text}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="d-flex mt-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type your message here..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;