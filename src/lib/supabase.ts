import { createClient } from '@supabase/supabase-js';

// Initialize database client using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseKey) {
  // Initialize Supabase client with provided credentials
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  // Provide a mock client for development without Supabase credentials
  console.warn(
    'Supabase environment variables not found. The app will run in limited mode without database functionality.\n' +
    'To enable full functionality, create a .env.local file with:\n' +
    'VITE_SUPABASE_URL=your_supabase_url\n' +
    'VITE_SUPABASE_ANON_KEY=your_supabase_anon_key'
  );

  // Create a mock client with no-op functions for development
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null }),
    }),
    auth: {
      signIn: () => Promise.resolve({ data: {}, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
    },
    // Add other necessary mock methods as needed
  };
}

export { supabase };