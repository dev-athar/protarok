// src/supabase.js
import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project details
const SUPABASE_URL = "https://<your-project-id>.supabase.co";
const SUPABASE_ANON_KEY = "<your-anon-key>";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
