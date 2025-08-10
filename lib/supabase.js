// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables check:");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Set" : "✗ Missing");
  
  // Don't throw error in development, just log warning
  if (process.env.NODE_ENV === 'development') {
    console.warn("Supabase not configured - some features may not work");
  } else {
    throw new Error(`Missing Supabase environment variables: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : ''}${!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}`);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
