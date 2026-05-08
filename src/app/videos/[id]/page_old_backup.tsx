'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import { 
  PlayIcon, 
  StarIcon, 
  ClockIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { canAccessVideo, formatDuration } from '@/lib/utils'
import ReactPlayer from 'react-player'
import toast from 'react-hot-toast'
import { getSecureVimeoUrl, getVimeoThumbnail, canAccessVimeoVideo } from '@/lib/vimeo'

// Mock video data with Vimeo IDs - will be replaced with Supabase data
const mockVideos = [
  {
    id: '1',
    title: 'פילאטיס לליבה חזקה',
    description: 'שיעור מתמקד בחיזוק שרירי הליבה והשיפור היציבה. נתחיל בחימום עדין, נעבור לתרגילי ליבה מאתגרים ונסיים במתיחות מרגיעות.',
    duration: 1800,
    difficulty: 'beginner' as const,
    focus_area: 'core',
    style: 'mat',
    vimeo_id: '123456789', // Replace with your actual Vimeo video ID
    thumbnail_url: '/api/placeholder/800/450',
    is_premium: false,
    instructor_notes: 'זכרי לנשום עמוק ולהקשיב לגוף שלך. אל תכפי על עצמך - כל תנועה צריכה להיות מבוקרת ומדויקת.'
  },
  {
    id: '2',
    title: 'גמישות וזרימה',
    description: 'שיעור עדין לשיפור הגמישות והתנועתיות',
    duration: 2700,
    difficulty: 'intermediate' as const,
    focus_area: 'flexibility',
    style: 'flow',
    vimeo_id: '987654321', // Replace with your actual Vimeo video ID
    thumbnail_url: '/api/placeholder/800/450',
    is_premium: true,
    instructor_notes: 'התמקדי בנשימה עמוקה ובתנועות זורמות. אל תדחקי את הגוף מעבר לגבולותיו.'
  },
  // Add more mock videos as needed
]

export default function VideoPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [video, setVideo] = useState<typeof mockVideos[0] | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [watchTime, setWatchTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)

  const videoId = params.id as string

  useEffect(() => {
    // Simulate loading video data
    const foundVideo = mockVideos.find(v => v.id === videoId)
    if (foundVideo) {
      setVideo(foundVideo)
    }
    setLoading(false)
  }, [videoId])

  const hasAccess = video ? canAccessVimeoVideo(
    video.vimeo_id,
    video.is_premium,
    profile?.subscription_type || null,
    profile?.lessons_remaining || null,
    profile?.subscription_expires_at || null
  ) : false

  // Get secure Vimeo URL for authenticated users
  const videoUrl = video && hasAccess && video.vimeo_id ? getSecureVimeoUrl(video.vimeo_id, user?.id) : null

  const toggleFavorite = async () => {
    if (!user || !video) return
    
    try {
      // TODO: Implement Supabase favorite toggle
      setIsFavorite(!isFavorite)
      toast.success(isFavorite ? 'הוסר ממועדפים' : 'נוסף למועדפים')
    } catch (error) {
      toast.error('שגיאה בעדכון מועדפים')
    }
  }

  const handleProgress = (progress: { playedSeconds: number }) => {
    setWatchTime(progress.playedSeconds)
    // TODO: Save progress to Supabase
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return translations.beginner
      case 'intermediate': return translations.intermediate
      case 'advanced': return translations.advanced
      default: return difficulty
    }
  }

  const getFocusAreaText = (focusArea: string) => {
    const areas: Record<string, string> = {
      core: translations.core,
      flexibility: translations.flexibility,
      strength: translations.strength,
      balance: translations.balance,
      posture: translations.posture,
      rehabilitation: translations.rehabilitation
    }
    return areas[focusArea] || focusArea
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-sage)] mx-auto mb-4"></div>
          <p className="text-[var(--color-soft-charcoal)]">{translations.loading}</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-lg text-[var(--color-charcoal)] mb-4">סרטון לא נמצא</h1>
          <p className="body-md text-[var(--color-soft-charcoal)] mb-6">הסרטון שחיפשת לא קיים או הוסר</p>
          <Link href="/videos" className="btn-primary">
            חזור לספריית הסרטונים
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Video Player Section */}
      <div className="bg-black">
        <div className="container py-8">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            {hasAccess ? (
              <ReactPlayer
                url={videoUrl || ''}
                width="100%"
                height="100%"
                controls
                playing={isPlaying}
                onProgress={handleProgress}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                config={{
                  vimeo: {
                    playerOptions: {
                      responsive: true,
                      dnt: true // Do not track
                    }
                  }
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-2xl font-semibold mb-4">נדרש מנוי לצפייה</h3>
                  <p className="text-lg mb-6">שדרג את המנוי שלך כדי לצפות בסרטון זה</p>
                  <Link href="/packages" className="btn-primary">
                    שדרג עכשיו
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      <div className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="heading-lg text-[var(--color-charcoal)]">{video.title}</h1>
                  {user && (
                    <button
                      onClick={toggleFavorite}
                      className="text-[var(--color-soft-charcoal)] hover:text-[var(--color-deep-sage)] transition-colors p-2"
                    >
                      {isFavorite ? (
                        <StarSolidIcon className="w-6 h-6 text-[var(--color-deep-sage)]" />
                      ) : (
                        <StarIcon className="w-6 h-6" />
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6 text-sm text-[var(--color-soft-charcoal)]">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {formatDuration(video.duration)}
                  </div>
                  <span className="bg-[var(--color-warm-gray)]/20 text-[var(--color-charcoal)] px-2 py-1 rounded">
                    {getDifficultyText(video.difficulty)}
                  </span>
                  <span>{getFocusAreaText(video.focus_area)}</span>
                  {video.is_premium && (
                    <span className="bg-[var(--color-sage)] text-white px-2 py-1 rounded text-xs font-semibold">
                      פרימיום
                    </span>
                  )}
                </div>

                <p className="body-lg text-[var(--color-soft-charcoal)] leading-relaxed mb-6">
                  {video.description}
                </p>

                {video.instructor_notes && (
                  <div className="card bg-[var(--color-warm-gray)]/20 p-6">
                    <div className="flex items-start gap-3">
                      <HeartIcon className="w-5 h-5 text-[var(--color-warm-terracotta)] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-[var(--color-charcoal)] mb-2">הערות מנועה</h3>
                        <p className="body-md text-[var(--color-soft-charcoal)]">
                          {video.instructor_notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-[var(--color-warm-gray)]/30">
                <Link
                  href="/videos"
                  className="flex items-center gap-2 text-[var(--color-deep-sage)] hover:text-[var(--color-sage)] transition-colors"
                >
                  <ArrowRightIcon className="w-4 h-4" />
                  חזור לספריית הסרטונים
                </Link>
                
                <div className="flex items-center gap-4">
                  {/* Previous/Next video navigation can be added here */}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {!user ? (
                <div className="card text-center mb-6">
                  <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">
                    רוצה לשמור התקדמות?
                  </h3>
                  <p className="text-[var(--color-soft-charcoal)] mb-4">
                    הירשם כדי לשמור מועדפים ולעקוב אחר ההתקדמות שלך
                  </p>
                  <Link href="/register" className="btn-primary w-full">
                    הירשם עכשיו
                  </Link>
                </div>
              ) : !hasAccess ? (
                <div className="card text-center mb-6">
                  <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">
                    שדרג למנוי פרימיום
                  </h3>
                  <p className="text-[var(--color-soft-charcoal)] mb-4">
                    קבל גישה לכל הסרטונים והתכנים החדשים
                  </p>
                  <Link href="/packages" className="btn-primary w-full">
                    שדרג עכשיו
                  </Link>
                </div>
              ) : (
                <div className="card mb-6">
                  <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-4">
                    ההתקדמות שלך
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-soft-charcoal)]">זמן צפייה:</span>
                      <span className="text-[var(--color-charcoal)]">{formatDuration(Math.floor(watchTime))}</span>
                    </div>
                    <div className="w-full bg-[var(--color-warm-gray)]/30 rounded-full h-2">
                      <div 
                        className="bg-[var(--color-sage)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((watchTime / video.duration) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-[var(--color-soft-charcoal)]">
                      {Math.floor((watchTime / video.duration) * 100)}% הושלם
                    </p>
                  </div>
                </div>
              )}

              {/* Related Videos - Placeholder */}
              <div className="card">
                <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-4">
                  סרטונים דומים
                </h3>
                <p className="text-[var(--color-soft-charcoal)] text-sm">
                  בקרוב - סרטונים מומלצים בהתאם לסגנון ורמת הקושי
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
