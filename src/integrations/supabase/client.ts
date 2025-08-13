// Temporary fallback client until Supabase is properly connected
console.warn('Supabase not yet configured. Please complete Supabase setup.');

export const supabase = {
  auth: {
    signInWithPassword: async () => {
      throw new Error('Please complete Supabase setup to enable authentication');
    },
    signUp: async () => {
      throw new Error('Please complete Supabase setup to enable authentication');
    },
    signOut: async () => {
      throw new Error('Please complete Supabase setup to enable authentication');
    },
    getUser: async () => ({ data: { user: null } }),
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        limit: () => Promise.resolve({ data: [] }),
        order: () => ({
          limit: () => Promise.resolve({ data: [] })
        }),
        single: () => Promise.resolve({ data: null })
      }),
      limit: () => Promise.resolve({ data: [] }),
      order: () => Promise.resolve({ data: [] })
    }),
    update: () => ({
      eq: () => Promise.resolve({ error: null })
    }),
    insert: () => Promise.resolve({ error: null })
  })
};