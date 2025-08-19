import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Lazy singleton client strictly using real environment variables
let supabaseSingleton: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl.includes('your_supabase_project_url_here') ||
      supabaseAnonKey.includes('your_supabase_anon_key_here') ||
      !supabaseUrl.startsWith('https://') ||
      !supabaseUrl.includes('.supabase.co')) {
    console.error(
      'Invalid Supabase configuration. Please update .env.local with real values from your Supabase project dashboard (Project Settings → API), then restart the dev server.'
    )
    return null
  }
  if (!supabaseSingleton) {
    supabaseSingleton = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseSingleton
}

// Client component client
export const createClientSupabase = () => {
  return getSupabaseClient()
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_type: 'free' | 'premium' | 'package' | null
          subscription_expires_at: string | null
          lessons_remaining: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_type?: 'free' | 'premium' | 'package' | null
          subscription_expires_at?: string | null
          lessons_remaining?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_type?: 'free' | 'premium' | 'package' | null
          subscription_expires_at?: string | null
          lessons_remaining?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          duration: number | null
          focus_area: string
          style: string
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          duration?: number | null
          focus_area: string
          style: string
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          duration?: number | null
          focus_area?: string
          style?: string
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          video_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          video_id: string
          completed: boolean
          watch_time: number
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          completed?: boolean
          watch_time?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          completed?: boolean
          watch_time?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
