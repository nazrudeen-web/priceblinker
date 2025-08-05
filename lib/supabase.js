import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://foqgnrgtsfruggxdjwvt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcWducmd0c2ZydWdneGRqd3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzA2NzUsImV4cCI6MjA2ODkwNjY3NX0.hAuO3S6kzssWAXIrCj1KCz0t9_VmvlMpppAUHm2WM4E";

export const supabase = createClient(supabaseUrl, supabaseKey);
