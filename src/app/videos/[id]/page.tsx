// דף נגן סרטון - Server Component
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import VideoPlayerClient from './VideoPlayerClient'

interface VideoPageProps {
  params: {
    id: string
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  const supabase = await createClient()
  const profile = await getCurrentUserProfile()

  // משיכת הסרטון מ-Supabase
  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !video) {
    redirect('/videos')
  }

  // בדיקת הרשאות
  const hasAccess = !video.is_premium || 
    profile?.subscription_id === 'Admin' || 
    profile?.user_type === 'admin' ||
    profile?.subscription_id?.startsWith('I-') ||
    (profile?.trial_start_date && 
      Math.floor((new Date().getTime() - new Date(profile.trial_start_date).getTime()) / (1000 * 60 * 60 * 24)) < 30)

  if (!hasAccess) {
    redirect('/packages')
  }

  // משיכת סרטונים קשורים
  const { data: relatedVideos } = await supabase
    .from('videos')
    .select('*')
    .neq('id', params.id)
    .limit(6)
    .order('created_at', { ascending: false })

  // משיכת התקדמות משתמש
  let userProgress = null
  if (profile) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', profile.id)
      .eq('video_id', video.id)
      .single()
    
    userProgress = progress
  }

  return (
    <VideoPlayerClient 
      video={video}
      profile={profile}
      relatedVideos={relatedVideos || []}
      initialProgress={userProgress}
    />
  )
}
