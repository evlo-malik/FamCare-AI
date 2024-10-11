import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://qaytvdmgjlmtvifqkptu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheXR2ZG1namxtdHZpZnFrcHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5NDUyMDksImV4cCI6MjA0MjUyMTIwOX0.b6c5J-jLHZJF9PqRhR_w401xjJ5RhDzdKWvQwyt-wWE')