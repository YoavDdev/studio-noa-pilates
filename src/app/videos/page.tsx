'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import { PlayIcon, StarIcon, ClockIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { canAccessVideo, formatDuration } from '@/lib/utils'

export default function VideosPage() {
  const { user, profile } = useAuth()
  const [selectedFocusArea, setSelectedFocusArea] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedStyle, setSelectedStyle] = useState<string>('all')
  const [favorites, setFavorites] = useState<string[]>([])

  // Mock videos data (will be replaced with real data from Supabase)
  const allVideos = [
    {
      id: '1',
      title: 'פילאטיס לליבה חזקה',
      description: 'שיעור מתמקד בחיזוק שרירי הליבה והשיפור היציבה',
      duration: 1800,
      difficulty: 'beginner' as const,
      focus_area: 'core',
      style: 'mat',
      thumbnail_url: '/api/placeholder/400/225',
      is_premium: false
    },
    {
      id: '2',
      title: 'גמישות וזרימה',
      description: 'שיעור עדין לשיפור הגמישות והתנועתיות',
      duration: 2700,
      difficulty: 'intermediate' as const,
      focus_area: 'flexibility',
      style: 'contemporary',
      thumbnail_url: '/api/placeholder/400/225',
      is_premium: true
    },
    {
      id: '3',
      title: 'פילאטיס מתקדם',
      description: 'אתגר לכל הגוף עם תרגילים מתקדמים',
      duration: 3600,
      difficulty: 'advanced' as const,
      focus_area: 'strength',
      style: 'classical',
      thumbnail_url: '/api/placeholder/400/225',
      is_premium: true
    },
    {
      id: '4',
      title: 'איזון ויציבה',
      description: 'שיעור לשיפור האיזון והיציבה',
      duration: 2400,
      difficulty: 'intermediate' as const,
      focus_area: 'balance',
      style: 'mat',
      thumbnail_url: '/api/placeholder/400/225',
      is_premium: false
    },
    {
      id: '5',
      title: 'פילאטיס לגיל הזהב',
      description: 'שיעור מותאם לגיל המבוגר',
      duration: 2100,
      difficulty: 'beginner' as const,
      focus_area: 'flexibility',
      style: 'seniors',
      thumbnail_url: '/api/placeholder/400/225',
      is_premium: true
    },
    {
      id: '6',
      title: 'שיקום וחיזוק',
      description: 'שיעור לשיקום פציעות וחיזוק שרירים',
      duration: 2700,
      difficulty: 'beginner' as const,
      focus_area: 'rehabilitation',
      style: 'mat',
      thumbnail_url: '/api/placeholder/400/225',
      is_premium: true
    }
  ]

  const focusAreas = [
    { value: 'all', label: 'הכל' },
    { value: 'core', label: translations.core },
    { value: 'flexibility', label: translations.flexibility },
    { value: 'strength', label: translations.strength },
    { value: 'balance', label: translations.balance },
    { value: 'posture', label: translations.posture },
    { value: 'rehabilitation', label: translations.rehabilitation }
  ]

  const difficulties = [
    { value: 'all', label: 'הכל' },
    { value: 'beginner', label: translations.beginner },
    { value: 'intermediate', label: translations.intermediate },
    { value: 'advanced', label: translations.advanced }
  ]

  const styles = [
    { value: 'all', label: 'הכל' },
    { value: 'classical', label: translations.classical },
    { value: 'contemporary', label: translations.contemporary },
    { value: 'reformer', label: translations.reformer },
    { value: 'mat', label: translations.mat },
    { value: 'prenatal', label: translations.prenatal },
    { value: 'seniors', label: translations.seniors }
  ]

  const filteredVideos = allVideos.filter(video => {
    if (selectedFocusArea !== 'all' && video.focus_area !== selectedFocusArea) return false
    if (selectedDifficulty !== 'all' && video.difficulty !== selectedDifficulty) return false
    if (selectedStyle !== 'all' && video.style !== selectedStyle) return false
    return true
  })

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return translations.beginner
      case 'intermediate': return translations.intermediate
      case 'advanced': return translations.advanced
      default: return difficulty
    }
  }

  const getFocusAreaText = (focusArea: string) => {
    const area = focusAreas.find(f => f.value === focusArea)
    return area ? area.label : focusArea
  }

  const getStyleText = (style: string) => {
    const styleItem = styles.find(s => s.value === style)
    return styleItem ? styleItem.label : style
  }

  const toggleFavorite = (videoId: string) => {
    if (!user) return
    
    setFavorites(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const hasAccess = (video: typeof allVideos[0]) => {
    if (!video.is_premium) return true
    return canAccessVideo(
      video.is_premium,
      profile?.subscription_type || null,
      profile?.lessons_remaining || null,
      profile?.subscription_expires_at || null
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] section-padding">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-lg text-[var(--color-charcoal)] mb-4">
            {translations.videos}
          </h1>
          <p className="body-md text-[var(--color-soft-charcoal)]">
            ספריית שיעורי הפילאטיס של נועה
          </p>
        </div>

        {/* User Status */}
        {user && (
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-charcoal)]">
                  שלום {profile?.full_name}!
                </h3>
                {profile?.subscription_type === 'premium' ? (
                  <p className="text-[var(--color-deep-sage)]">יש לך גישה פרימיום פעילה</p>
                ) : profile?.subscription_type === 'package' && profile?.lessons_remaining ? (
                  <p className="text-[var(--color-sage)]">
                    נותרו לך {profile.lessons_remaining} שיעורים
                  </p>
                ) : (
                  <p className="text-[var(--color-soft-charcoal)]">גישה חופשית - רק לסרטונים חינמיים</p>
                )}
              </div>
              {profile?.subscription_type !== 'premium' && (
                <Link
                  href="/packages"
                  className="btn-primary"
                >
                  {translations.upgradeNow}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-[var(--color-soft-charcoal)]" />
            <h3 className="text-lg font-semibold text-[var(--color-charcoal)]">סינון</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                אזור מיקוד
              </label>
              <select
                value={selectedFocusArea}
                onChange={(e) => setSelectedFocusArea(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none border-[var(--color-warm-gray)] focus:border-[var(--color-sage)] text-[var(--color-charcoal)]"
              >
                {focusAreas.map(area => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                רמת קושי
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none border-[var(--color-warm-gray)] focus:border-[var(--color-sage)] text-[var(--color-charcoal)]"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">
                סגנון
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none border-[var(--color-warm-gray)] focus:border-[var(--color-sage)] text-[var(--color-charcoal)]"
              >
                {styles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => {
            const userHasAccess = hasAccess(video)
            const isFavorite = favorites.includes(video.id)
            
            return (
              <div key={video.id} className="card overflow-hidden hover:shadow-[var(--shadow-large)] transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-[var(--color-warm-gray)]/30 flex items-center justify-center">
                    <PlayIcon className="w-16 h-16 text-[var(--color-soft-charcoal)]" />
                  </div>
                  
                  {video.is_premium && (
                    <div className="absolute top-2 left-2 bg-[var(--color-sage)] text-white px-2 py-1 rounded text-sm font-semibold shadow">
                      פרימיום
                    </div>
                  )}
                  
                  {!userHasAccess && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-2xl mb-2">🔒</div>
                        <p className="text-sm">נדרש מנוי</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[var(--color-charcoal)] mb-2">
                    {video.title}
                  </h3>
                  <p className="text-[var(--color-soft-charcoal)] mb-4">
                    {video.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-[var(--color-soft-charcoal)]">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {formatDuration(video.duration)}
                      </div>
                      <span className="bg-[var(--color-warm-gray)]/20 text-[var(--color-charcoal)] px-2 py-1 rounded">
                        {getDifficultyText(video.difficulty)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-[var(--color-soft-charcoal)]">
                      <span>{getFocusAreaText(video.focus_area)}</span>
                      <span>{getStyleText(video.style)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {userHasAccess ? (
                      <Link
                        href={`/videos/${video.id}`}
                        className="btn-primary"
                      >
                        {translations.watchNow}
                      </Link>
                    ) : (
                      <Link
                        href="/packages"
                        className="btn-secondary"
                      >
                        שדרג לצפייה
                      </Link>
                    )}
                    
                    {user && (
                      <button 
                        onClick={() => toggleFavorite(video.id)}
                        className="text-[var(--color-soft-charcoal)] hover:text-[var(--color-deep-sage)] transition-colors"
                      >
                        {isFavorite ? (
                          <StarSolidIcon className="w-6 h-6 text-[var(--color-deep-sage)]" />
                        ) : (
                          <StarIcon className="w-6 h-6" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-soft-charcoal)] text-lg">
              לא נמצאו סרטונים התואמים לקריטריונים שבחרת
            </p>
            <button
              onClick={() => {
                setSelectedFocusArea('all')
                setSelectedDifficulty('all')
                setSelectedStyle('all')
              }}
              className="mt-4 text-[var(--color-deep-sage)] hover:text-[var(--color-sage)]"
            >
              נקה סינון
            </button>
          </div>
        )}

        {!user && (
          <div className="card mt-8 text-center">
            <h3 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">
              רוצה גישה לכל הסרטונים?
            </h3>
            <p className="text-[var(--color-soft-charcoal)] mb-4">
              הירשם עכשיו וקבל גישה לספריית הסרטונים המלאה
            </p>
            <Link
              href="/register"
              className="btn-primary inline-block"
            >
              {translations.signUp}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
