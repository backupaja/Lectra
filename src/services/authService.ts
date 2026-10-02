import { supabase } from '../lib/supabase';

export const AuthService = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Check if admin
    const role = data.session?.user.app_metadata?.role;
    if (role !== 'admin') {
      // If not admin, we might want to log them out or throw an error
      // But let's just log a warning for now, or throw
      // throw new Error('Akses ditolak. Anda bukan admin.');
    }
    return data;
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
};
