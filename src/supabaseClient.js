import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://otnuuwigqsfpkrfdvgpj.supabase.co' 

// ส่วน Key ให้ก๊อปปี้มาวางใหม่ให้ชัวร์อีกรอบครับ (ใช้ anon public)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bnV1d2lncXNmcGtyZmR2Z3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDEyNjMsImV4cCI6MjA5MzQ3NzI2M30.xDkxcE5Lj2Bi-beFLC7ftWuABd--otRlCaDyHCaTKCc' 

export const supabase = createClient(supabaseUrl, supabaseKey)