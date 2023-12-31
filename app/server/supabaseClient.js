import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://tyldtyivzeqiedyvaulp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bGR0eWl2emVxaWVkeXZhdWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0OTMyNTksImV4cCI6MjAxOTA2OTI1OX0.gnzqkr--5yidlOATQbZauqDLDf-leOIBV8AQTN7EX8s'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase