// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables:", {
    url: supabaseUrl ? "✓ Set" : "✗ Missing NEXT_PUBLIC_SUPABASE_URL",
    key: supabaseAnonKey ? "✓ Set" : "✗ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
  });
  throw new Error(`Missing Supabase environment variables: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : ''}${!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
