// דף סרטונים - Server Component
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/lib/auth-helpers'
import VideosClient from './VideosClient'

export default async function VideosPage() {
  const supabase = await createClient()
  const profile = await getCurrentUserProfile()

  // משיכת כל הסרטונים מ-Supabase
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching videos:', error)
  }

  // משיכת מועדפים של המשתמש
  let userFavorites: string[] = []
  if (profile) {
    const { data: favs } = await supabase
      .from('user_favorites')
      .select('video_id')
      .eq('user_id', profile.id)
    
    userFavorites = favs?.map(f => f.video_id) || []
  }

  return (
    <VideosClient 
      videos={videos || []} 
      profile={profile}
      initialFavorites={userFavorites}
    />
  )
}
