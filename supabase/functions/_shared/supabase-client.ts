import { createClient } from "npm:@supabase/supabase-js";

const SUPABASE_URL = "https://jqrocfmfnsuhjduyxsud.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxcm9jZm1mbnN1aGpkdXl4c3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4Mzc0MjQsImV4cCI6MjA0NDQxMzQyNH0.t4Wtdw0ST2QN-4pMVPASKNdWKBPQPYG53xAtpCn5hXc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
