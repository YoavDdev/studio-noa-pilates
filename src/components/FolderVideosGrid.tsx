'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ClockIcon } from '@heroicons/react/24/outline'

interface Video {
  uri: string
  name: string
  description: string | null
  duration: number
  pictures: { sizes: { link: string }[] } | null
  created_time: string
  category: string | null
}

interface Subfolder {
  uri: string
  name: string
  videoCount: number
  subtitle: string
}

interface Props {
  folderName: string
  allVideos: Video[]
  subfolders: Subfolder[]
}

const PAGE_SIZE = 24

export default function FolderVideosGrid({ folderName, allVideos, subfolders }: Props) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const hasSubfolders = subfolders.length > 0

  // Filter videos based on active filter
  const filteredVideos = activeFilter === null
    ? allVideos
    : allVideos.filter(v => v.category === activeFilter)

  // Count videos per category for the pills
  const directCount = allVideos.filter(v => v.category === null).length

  const handleFilterClick = (category: string | null) => {
    setActiveFilter(prev => prev === category ? null : category)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <>
      {/* Filter strip */}
      {hasSubfolders && (
        <div className="border-b border-[#EBE5DC] bg-[#FAF8F3]">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {/* "הכל" pill */}
              <button
                onClick={() => setActiveFilter(null)}
                className={`shrink-0 font-body text-sm px-4 py-1.5 border transition-all duration-300 ${
                  activeFilter === null
                    ? 'border-[#C9A871] bg-[#C9A871]/10 text-[#1A1410]'
                    : 'border-[#EBE5DC] text-[#A39888] hover:border-[#C9A871] hover:text-[#1A1410]'
                }`}
              >
                הכל
                <span className="text-[10px] mr-1.5 opacity-60">{allVideos.length}</span>
              </button>

              {/* Subfolder pills */}
              {subfolders.map(sub => {
                const count = allVideos.filter(v => v.category === sub.name).length
                return (
                  <button
                    key={sub.name}
                    onClick={() => handleFilterClick(sub.name)}
                    className={`shrink-0 font-body text-sm px-4 py-1.5 border transition-all duration-300 ${
                      activeFilter === sub.name
                        ? 'border-[#C9A871] bg-[#C9A871]/10 text-[#1A1410]'
                        : 'border-[#EBE5DC] text-[#A39888] hover:border-[#C9A871] hover:text-[#1A1410]'
                    }`}
                  >
                    {sub.name}
                    <span className="text-[10px] mr-1.5 opacity-60">{count}</span>
                  </button>
                )
              })}

              {/* "כללי" pill only if there are direct (uncategorized) videos AND subfolders */}
              {directCount > 0 && (
                <button
                  onClick={() => handleFilterClick('__direct__')}
                  className={`shrink-0 font-body text-sm px-4 py-1.5 border transition-all duration-300 ${
                    activeFilter === '__direct__'
                      ? 'border-[#C9A871] bg-[#C9A871]/10 text-[#1A1410]'
                      : 'border-[#EBE5DC] text-[#A39888] hover:border-[#C9A871] hover:text-[#1A1410]'
                  }`}
                >
                  כללי
                  <span className="text-[10px] mr-1.5 opacity-60">{directCount}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Videos grid */}
      <div className="py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12">
          {/* Active filter label */}
          {activeFilter && activeFilter !== '__direct__' && (
            <div className="flex items-center gap-3 mb-6">
              <p className="font-body text-xs tracking-[0.15em] uppercase text-[#A39888]">
                {activeFilter}
              </p>
              <div className="flex-1 h-px bg-[#EBE5DC]" />
              <button
                onClick={() => setActiveFilter(null)}
                className="font-body text-xs text-[#C9A871] hover:text-[#1A1410] transition-colors"
              >
                הראי הכל
              </button>
            </div>
          )}

          {filteredVideos.length > 0 ? (
            <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(activeFilter === '__direct__' 
                ? allVideos.filter(v => v.category === null)
                : filteredVideos
              ).slice(0, visibleCount).map((video, index) => {
                const vimeoId = video.uri.split('/').pop()
                const thumbnail = video.pictures?.sizes?.[3]?.link || '/img/placeholder.jpg'

                return (
                  <Link
                    key={video.uri}
                    href={`/videos/${encodeURIComponent(folderName)}/${vimeoId}`}
                    className="group block fade-in-up"
                    style={{ animationDelay: `${index * 0.06}s` }}
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

                      {/* Category badge on thumbnail */}
                      {activeFilter === null && video.category && (
                        <span className="absolute bottom-2 right-2 font-body text-[10px] bg-[#1A1410]/70 text-white px-2 py-0.5">
                          {video.category}
                        </span>
                      )}
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
                    {video.duration && (
                      <div className="flex items-center gap-1.5 font-body text-xs text-[#A39888]">
                        <ClockIcon className="w-3.5 h-3.5" />
                        <span>{Math.floor(video.duration / 60)} דקות</span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
            {/* Load more button */}
            {visibleCount < filteredVideos.length && (
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
            <div className="text-center py-16">
              <p className="font-body text-sm text-[#A39888]">אין שיעורים בקטגוריה זו</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
