import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    role?: 'patient' | 'doctor';
  };
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: 'patient' | 'doctor';
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  specialization: string;
  license_number: string;
  phone: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const signUp = async (email: string, password: string, fullName: string, role: 'patient' | 'doctor') => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
        role: role
      }
    }
  });

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<{ user: User | null; session: Session | null }> => {
  const { data: { session } } = await supabase.auth.getSession();
  return { user: session?.user ?? null, session };
};

export const getUserProfile = async (userId: string): Promise<{ profile: Profile | null; error: any }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  return { profile: data as Profile | null, error };
};

export const createDoctorProfile = async (doctorData: {
  specialization: string;
  license_number: string;
  phone?: string;
  bio?: string;
}) => {
  const { data, error } = await supabase
    .from('doctors')
    .insert([{
      user_id: (await getCurrentUser()).user?.id,
      ...doctorData
    }])
    .select()
    .single();

  return { data, error };
};