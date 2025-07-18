// Deprecated: Supabase client has been migrated to use server-side PostgreSQL
// Use the new API client from '@/lib/api' instead

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://uvqyhftgqonejozdefaa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cXloZnRncW9uZWpvemRlZmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NDE5ODMsImV4cCI6MjA2NzIxNzk4M30.jVXBI8e65fz-7qwCs5nOxzqg_lfSznUkilvtA5i0i0w";

// Legacy compatibility - keeping for auth features that still need Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});