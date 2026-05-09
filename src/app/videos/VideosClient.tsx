'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PlayIcon, ClockIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Video {
  id: string
  vimeo_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  duration: number
  difficulty_level: string | null
  focus_area: string | null
  category: string | null
  is_premium: boolean
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  subscription_id: string | null
  user_type: string | null
  trial_start_date: string | null
}

interface VideosClientProps {
  videos: Video[]
  profile: Profile | null
  initialFavorites: string[]
}

export default function VideosClient({ videos, profile, initialFavorites }: VideosClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [favorites, setFavorites] = useState<string[]>(initialFavorites)

  // סינון סרטונים
  const filteredVideos = videos.filter(video => {
    // חיפוש טקסט
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchTitle = video.title?.toLowerCase().includes(query)
      const matchDescription = video.description?.toLowerCase().includes(query)
      if (!matchTitle && !matchDescription) return false
    }

    // סינון לפי קטגוריה
    if (selectedCategory !== 'all' && video.category !== selectedCategory) {
      return false
    }

    return true
  })

  // קטגוריות ייחודיות
  const categories = ['all', ...new Set(videos.map(v => v.category).filter(Boolean))]

  // בדיקת גישה לסרטון
  const hasAccess = (video: Video) => {
    if (!video.is_premium) return true
    if (!profile) return false
    
    // Admin - גישה מלאה
    if (profile.subscription_id === 'Admin' || profile.user_type === 'admin') return true
    
    // PayPal subscription
    if (profile.subscription_id?.startsWith('I-')) return true
    
    // Trial
    if (profile.trial_start_date) {
      const trialStart = new Date(profile.trial_start_date)
      const now = new Date()
      const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24))
      if (daysPassed < 30) return true
    }
    
    return false
  }

  // פורמט זמן
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} דקות`
  }

  // טוגל מועדפים
  const toggleFavorite = async (videoId: string) => {
    if (!profile) return
    
    const isFavorite = favorites.includes(videoId)
    
    try {
      if (isFavorite) {
        // הסרה
        setFavorites(prev => prev.filter(id => id !== videoId))
        // TODO: API call to remove favorite
      } else {
        // הוספה
        setFavorites(prev => [...prev, videoId])
        // TODO: API call to add favorite
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎥 ספריית הסרטונים
          </h1>
          <p className="text-xl text-gray-600">
            {videos.length} שיעורי פילאטיס של נועה
          </p>
        </div>

        {/* User Status */}
        {profile && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  שלום {profile.full_name || 'משתמש'}! 👋
                </h3>
                {profile.subscription_id === 'Admin' || profile.user_type === 'admin' ? (
                  <p className="text-purple-600 font-semibold">👑 גישת Admin - גישה מלאה לכל הסרטונים</p>
                ) : profile.subscription_id?.startsWith('I-') ? (
                  <p className="text-green-600 font-semibold">✅ מנוי פעיל - גישה מלאה</p>
                ) : profile.trial_start_date ? (
                  <p className="text-blue-600 font-semibold">🎁 תקופת ניסיון - גישה מלאה</p>
                ) : (
                  <p className="text-gray-600">גישה חופשית - רק לסרטונים חינמיים</p>
                )}
              </div>
              {!profile.subscription_id?.startsWith('I-') && profile.subscription_id !== 'Admin' && (
                <Link
                  href="/packages"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  שדרג עכשיו
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FunnelIcon className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">חיפוש וסינון</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="חפש סרטון..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                קטגוריה
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat || 'unknown'} value={cat || ''}>
                    {cat === 'all' ? 'הכל' : cat || 'ללא קטגוריה'}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                מציג {filteredVideos.length} מתוך {videos.length} סרטונים
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const userHasAccess = hasAccess(video)
            const isFavorite = favorites.includes(video.id)

            return (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100">
                  {video.thumbnail_url ? (
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayIcon className="w-20 h-20 text-purple-300" />
                    </div>
                  )}

                  {/* Premium Badge */}
                  {video.is_premium && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      ⭐ פרימיום
                    </div>
                  )}

                  {/* Lock Overlay */}
                  {!userHasAccess && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center text-white">
                        <div className="text-5xl mb-2">🔒</div>
                        <p className="font-bold">נדרש מנוי</p>
                      </div>
                    </div>
                  )}

                  {/* Duration */}
                  {video.duration > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  {video.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {video.description}
                    </p>
                  )}

                  {/* Tags */}
                  {video.category && (
                    <div className="mb-4">
                      <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {video.category}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    {userHasAccess ? (
                      <Link
                        href={`/videos/${video.id}`}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all text-center"
                      >
                        ▶️ צפה עכשיו
                      </Link>
                    ) : (
                      <Link
                        href="/packages"
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition-all text-center"
                      >
                        🔓 שדרג לצפייה
                      </Link>
                    )}

                    {/* Favorite Button */}
                    {profile && (
                      <button
                        onClick={() => toggleFavorite(video.id)}
                        className="mr-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isFavorite ? (
                          <StarSolidIcon className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <StarOutlineIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              לא נמצאו סרטונים
            </h3>
            <p className="text-gray-600 mb-6">
              נסה לשנות את הסינון או החיפוש
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              נקה סינון
            </button>
          </div>
        )}

        {/* CTA for non-logged users */}
        {!profile && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-2xl p-8 mt-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">
              רוצה גישה לכל הסרטונים? 🎯
            </h3>
            <p className="text-xl mb-6 opacity-90">
              הירשם עכשיו וקבל גישה מלאה לספריית הסרטונים של נועה
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              הירשם עכשיו →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
