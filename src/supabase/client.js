import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjfjomyjbsasuxlyqgpj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZmpvbXlqYnNhc3V4bHlxZ3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTAzODEsImV4cCI6MjA5NTc4NjM4MX0.SMzCbKT0o6YdCam6Lz-l-7dej5OBRHQbGlL-yd4EaXo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);