import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jeoswprqdlcqsmebjvwv.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb3N3cHJxZGxjcXNtZWJqdnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MzMwOTUsImV4cCI6MjEwMTAwOTA5NX0.goYRAsWlOa3fAPvNRTVTXDs7Kzl8Tu6OMse92-gsDWc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
