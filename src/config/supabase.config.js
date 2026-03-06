// Supabase Configuration
// Get your credentials from: https://app.supabase.com > Project Settings > API

import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your Supabase project credentials
// Get them from: Supabase Dashboard > Project Settings > API
// In Vite, use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false, // We're using Firebase Auth, not Supabase Auth
    },
});

// Log initialization status
if (supabaseUrl && supabaseAnonKey) {
    console.log('☁️ Supabase Storage configured');
    console.log('🔗 URL:', supabaseUrl);
} else {
    console.warn('⚠️ Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
}

export default supabase;
