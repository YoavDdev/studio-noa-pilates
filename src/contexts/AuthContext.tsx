'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientSupabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabase()

  useEffect(() => {
    // If Supabase is not configured, skip initialization
    if (!supabase) {
      setLoading(false)
      return
    }

    const fetchProfile = async (userId: string, retryCount = 0) => {
      try {
        console.log('Fetching profile for user:', userId, retryCount > 0 ? `(retry ${retryCount})` : '')
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()
        
        console.log('Profile fetch result:', { data, error })

        if (error) {
          console.error('Profile fetch error:', error)
          setProfile(null)
          return
        }

        if (data) {
          console.log('Profile loaded successfully:', data)
          setProfile(data as Profile)
        } else {
          console.log('No profile found for user')
          setProfile(null)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        // Retry once after 2 seconds
        if (retryCount < 1) {
          console.log('Retrying profile fetch in 2 seconds...')
          setTimeout(() => fetchProfile(userId, retryCount + 1), 2000)
          return
        }
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    let initialSessionHandled = false

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (event: string, session: any) => {
        console.log('Auth state changed:', event)
        const typedSession = session as { user?: User } | null
        setUser(typedSession?.user ?? null)
        
        // Skip SIGNED_IN during initialization - wait for INITIAL_SESSION
        if (event === 'SIGNED_IN' && !initialSessionHandled) {
          console.log('Skipping SIGNED_IN during init, waiting for INITIAL_SESSION')
          return
        }
        
        if (typedSession?.user) {
          await fetchProfile(typedSession.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
        
        if (event === 'INITIAL_SESSION') {
          initialSessionHandled = true
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })
    
    if (error) throw error
    
    // Profile will be created automatically by the database trigger
    // No need to manually insert into profiles table
  }

  const resetPassword = async (email: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (!supabase) {
      console.log('Supabase not configured - clearing local state')
      setUser(null)
      setProfile(null)
      return
    }
    
    console.log('Signing out...')
    
    try {
      // Sign out from Supabase - this clears session and cookies
      await supabase.auth.signOut()
      console.log('Successfully signed out from Supabase')
    } catch (error) {
      console.error('Sign out error (non-blocking):', error)
    }
    
    // Clear local state after signOut completes
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !supabase) return
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    
    if (error) throw error
    
    setProfile(prev => prev ? { ...prev, ...updates } : null)
  }

  // If Supabase is not configured, provide a mock context
  if (!supabase) {
    const mockValue = {
      user: null,
      profile: null,
      loading: false,
      signIn,
      signInWithGoogle,
      signUp,
      signOut,
      resetPassword,
      updateProfile,
    }
    return <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
