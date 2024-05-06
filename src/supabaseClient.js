import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hmtizusrdgvzczkbpmec.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtdGl6dXNyZGd2emN6a2JwbWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3Njc2NTUsImV4cCI6MjAyOTM0MzY1NX0.8Bw_q-qlsWxAPDaq0jVKpCkB7-bkcD9ytZ3F09tPmdI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        // Adjust as needed, or remove if defaults are sufficient
        eventsPerSecond: 10,
      }
    },
  });