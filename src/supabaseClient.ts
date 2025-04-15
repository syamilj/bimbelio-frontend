import { env } from '@/env.mjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_SECRET_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
