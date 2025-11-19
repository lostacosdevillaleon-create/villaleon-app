// CONFIGURACIÓN DE SUPABASE - REEMPLAZA CON TUS DATOS
const SUPABASE_URL = 'https://awxsvamuuhujadfaipwz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3eHN2YW11dWh1amFkZmFpcHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjM1MjYsImV4cCI6MjA3NzQ5OTUyNn0.WZFqB__vfHDECTAUWPic-aXL23zATFSMdOpfnXLTMiI';

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('✅ Supabase configurado');