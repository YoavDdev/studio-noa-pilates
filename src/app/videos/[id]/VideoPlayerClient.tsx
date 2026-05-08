'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowRightIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface Video {
  id: string
  vimeo_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  duration: number
  category: string | null
  is_premium: boolean
}

interface Profile {
  id: string
  email: string
  full_name: string | null
}

interface Progress {
  completed: boolean
  watch_time: number
  resume_time: number | null
}

interface VideoPlayerClientProps {
  video: Video
  profile: Profile | null
  relatedVideos: Video[]
  initialProgress: Progress | null
}

export default function VideoPlayerClient({ 
  video, 
  profile, 
  relatedVideos,
  initialProgress 
}: VideoPlayerClientProps) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(initialProgress?.completed || false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialProgress?.resume_time || 0)
  const playerRef = useRef<HTMLIFrameElement>(null)

  // פורמט זמן
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} דקות`
  }

  // סימון כהושלם
  const toggleCompleted = async () => {
    if (!profile) return

    try {
      setIsCompleted(!isCompleted)
      toast.success(isCompleted ? 'הסרטון סומן כלא הושלם' : 'כל הכבוד! סיימת את השיעור! 🎉')
      
      // TODO: API call to update progress
    } catch (error) {
      console.error('Error toggling completed:', error)
      toast.error('שגיאה בעדכון ההתקדמות')
    }
  }

  // טוגל מועדפים
  const toggleFavorite = async () => {
    if (!profile) return

    try {
      setIsFavorite(!isFavorite)
      toast.success(isFavorite ? 'הוסר מהמועדפים' : 'נוסף למועדפים ⭐')
      
      // TODO: API call to toggle favorite
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('שגיאה בעדכון המועדפים')
    }
  }

  // Vimeo Embed URL
  const vimeoEmbedUrl = `https://player.vimeo.com/video/${video.vimeo_id}?badge=0&autopause=0&player_id=0&app_id=${process.env.NEXT_PUBLIC_VIMEO_APP_ID}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/videos"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-semibold"
        >
          <ArrowRightIcon className="w-5 h-5" />
          חזרה לספריה
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-6">
              <div className="aspect-video bg-black">
                <iframe
                  ref={playerRef}
                  src={vimeoEmbedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                />
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {video.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {video.duration > 0 && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {formatDuration(video.duration)}
                        </div>
                      )}
                      {video.category && (
                        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {video.category}
                        </span>
                      )}
                      {video.is_premium && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                          ⭐ פרימיום
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {profile && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleCompleted}
                        className={`p-3 rounded-lg transition-all ${
                          isCompleted 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={isCompleted ? 'סומן כהושלם' : 'סמן כהושלם'}
                      >
                        {isCompleted ? (
                          <CheckCircleSolidIcon className="w-6 h-6" />
                        ) : (
                          <CheckCircleIcon className="w-6 h-6" />
                        )}
                      </button>

                      <button
                        onClick={toggleFavorite}
                        className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title={isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
                      >
                        {isFavorite ? (
                          <StarSolidIcon className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <StarOutlineIcon className="w-6 h-6 text-gray-600" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                {video.description && (
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 mb-2">תיאור השיעור</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {video.description}
                    </p>
                  </div>
                )}

                {/* Progress Indicator */}
                {profile && isCompleted && (
                  <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircleSolidIcon className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-bold text-green-900">סיימת את השיעור הזה! 🎉</h4>
                        <p className="text-sm text-green-700">כל הכבוד על ההתמדה!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                שיעורים נוספים
              </h2>

              <div className="space-y-4">
                {relatedVideos.map((relatedVideo) => (
                  <Link
                    key={relatedVideo.id}
                    href={`/videos/${relatedVideo.id}`}
                    className="block group"
                  >
                    <div className="flex gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                      {/* Thumbnail */}
                      <div className="relative w-32 h-20 flex-shrink-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden">
                        {relatedVideo.thumbnail_url ? (
                          <img
                            src={relatedVideo.thumbnail_url}
                            alt={relatedVideo.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PlayIcon className="w-8 h-8 text-purple-300" />
                          </div>
                        )}
                        {relatedVideo.duration > 0 && (
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white px-2 py-0.5 rounded text-xs">
                            {formatDuration(relatedVideo.duration)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-1">
                          {relatedVideo.title}
                        </h3>
                        {relatedVideo.category && (
                          <span className="text-xs text-gray-500">
                            {relatedVideo.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {relatedVideos.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  אין שיעורים נוספים כרגע
                </p>
              )}

              {/* Back to Library */}
              <Link
                href="/videos"
                className="block mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                צפה בכל השיעורים →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
