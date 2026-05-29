'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ClockIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Video {
  uri: string
  name: string
  description: string | null
  duration: number
  pictures: { sizes: { link: string }[] } | null
  created_time: string
  folderName: string
}

const PAGE_SIZE = 24

export default function ExplorePage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos/all')
        const data = await res.json()
        setVideos(data.videos || [])
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Reset pagination when search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [search])

  // Filter videos based on search (title + description)
  const filteredVideos = useMemo(() => {
    if (!search.trim()) return videos
    const query = search.trim().toLowerCase()
    return videos.filter(v => 
      v.name.toLowerCase().includes(query) ||
      (v.description && v.description.toLowerCase().includes(query))
    )
  }, [videos, search])

  const visibleVideos = filteredVideos.slice(0, visibleCount)
  const hasMore = visibleCount < filteredVideos.length

  return (
    <main className="min-h-screen bg-[#FDFCFA]">

      {/* Header + Search */}
      <section className="pt-8 pb-5 border-b border-[#EBE5DC] sticky top-0 bg-[#FDFCFA]/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-light text-[#1A1410]">
                כל השיעורים
              </h1>
              {!loading && (
                <p className="font-body text-sm text-[#A39888] mt-0.5">
                  {filteredVideos.length} שיעורים {search && `עבור "${search}"`}
                </p>
              )}
            </div>
            <Link
              href="/videos"
              className="font-body text-xs tracking-[0.15em] uppercase text-[#A39888] hover:text-[#C9A871] transition-colors"
            >
              לסוגי השיעורים ←
            </Link>
          </div>

          {/* Search input */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A39888]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חפשי שיעור לפי שם או תיאור..."
              className="w-full font-body text-sm text-[#1A1410] border border-[#EBE5DC] pr-11 pl-4 py-3 bg-transparent focus:border-[#C9A871] focus:outline-none transition-colors placeholder:text-[#C4BAA8]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-xs text-[#A39888] hover:text-[#1A1410] transition-colors"
              >
                נקי
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-[#EBE5DC] mb-4" />
                  <div className="h-5 bg-[#EBE5DC] w-3/4 mb-2" />
                  <div className="h-4 bg-[#EBE5DC] w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {visibleVideos.map((video, index) => {
                  const vimeoId = video.uri.split('/').pop()
                  const thumbnail = video.pictures?.sizes?.[3]?.link || '/img/placeholder.jpg'

                  return (
                    <Link
                      key={video.uri}
                      href={`/videos/${encodeURIComponent(video.folderName)}/${vimeoId}`}
                      className="group block fade-in-up"
                      style={{ animationDelay: `${Math.min(index, 12) * 0.04}s` }}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video relative overflow-hidden mb-4 bg-[#EBE5DC]">
                        <Image
                          src={thumbnail}
                          alt={video.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-[#1A1410]/0 group-hover:bg-[#1A1410]/20 transition-colors duration-500" />
                        
                        {/* Folder badge */}
                        <span className="absolute bottom-2 right-2 font-body text-[10px] bg-[#1A1410]/70 text-white px-2 py-0.5">
                          {video.folderName}
                        </span>
                      </div>

                      {/* Info */}
                      <h3 className="font-heading text-lg font-light text-[#1A1410] mb-1.5 line-clamp-2 group-hover:text-[#C9A871] transition-colors duration-300">
                        {video.name}
                      </h3>
                      {video.description && (
                        <p className="font-body text-sm text-[#5C4D3C] mb-2 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 font-body text-xs text-[#A39888]">
                        {video.duration > 0 && (
                          <div className="flex items-center gap-1.5">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>{Math.floor(video.duration / 60)} דקות</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
              {/* Load more button */}
              {hasMore && (
                <div className="flex justify-center pt-10">
                  <button
                    onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                    className="font-body text-sm tracking-wider border border-[#EBE5DC] px-8 py-3 text-[#5C4D3C] hover:border-[#C9A871] hover:text-[#1A1410] transition-all duration-300"
                  >
                    הראי עוד ({filteredVideos.length - visibleCount} נוספים)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-8 h-px bg-[#C9A871] mx-auto mb-6" />
              <p className="font-heading text-xl font-light text-[#A39888] mb-2">
                לא נמצאו שיעורים
              </p>
              <p className="font-body text-sm text-[#C4BAA8]">
                נסי לחפש משהו אחר
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
