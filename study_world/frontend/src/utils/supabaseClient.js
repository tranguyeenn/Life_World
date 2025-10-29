import { createClient } from '@supabase/supabase-js'

console.log('URL from env:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key from env:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Loaded ✓' : 'Missing ✗')

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
