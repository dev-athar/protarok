// src/supabase.js
import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project details
const SUPABASE_URL = "https://sifneaujnvssmmholqep.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZm5lYXVqbnZzc21taG9scWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1Nzg3OTYsImV4cCI6MjA1MTE1NDc5Nn0.zF7HMOg0-BrktsjLbYnVq5kqcp5-WHRwPWzEX9ggRew";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
