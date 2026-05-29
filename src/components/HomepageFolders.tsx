'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Folder {
  uri: string
  name: string
  subtitle?: string
  metadata?: { description?: string }
}

export default function HomepageFolders() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFolders() {
      try {
        const res = await fetch('/api/folders')
        const data = await res.json()
        setFolders(data.folders || [])
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchFolders()
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-[#F5EFE6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-[#A39888] mb-4">מרחב השיעורים</p>
            <h2 className="font-heading text-[clamp(2.25rem,4.5vw,3.5rem)] font-light text-[#1A1410]">בחרי את הדרך שלך</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBE5DC]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#FDFCFA] p-8 sm:p-10 md:p-12 animate-pulse">
                <div className="h-8 bg-[#EBE5DC] w-2/3 mb-4" />
                <div className="h-4 bg-[#EBE5DC] w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-[#F5EFE6]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-[#A39888] mb-4 fade-in-up">
            מרחב השיעורים
          </p>
          <h2 className="font-heading text-[clamp(2.25rem,4.5vw,3.5rem)] font-light text-[#1A1410] fade-in-up" style={{ animationDelay: '0.1s' }}>
            בחרי את הדרך שלך
          </h2>
        </div>

        {folders.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBE5DC]">
              {folders.slice(0, 6).map((folder, i) => (
                <Link
                  key={folder.uri}
                  href={`/videos/${encodeURIComponent(folder.name)}`}
                  className="group block bg-[#FDFCFA] p-8 sm:p-10 md:p-12 hover:bg-[#F5EFE6] transition-colors duration-500 fade-in-up"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <h3 className="font-heading text-2xl md:text-3xl font-light text-[#1A1410] mb-4 group-hover:text-[#C9A871] transition-colors duration-300">
                    {folder.name}
                  </h3>
                  {(folder.subtitle || folder.metadata?.description) && (
                    <p className="font-body text-sm leading-7 text-[#5C4D3C] line-clamp-2">
                      {folder.subtitle || folder.metadata?.description}
                    </p>
                  )}
                  <div className="mt-8 w-0 h-px bg-[#C9A871] group-hover:w-12 transition-all duration-500" />
                </Link>
              ))}
            </div>
            {folders.length > 6 && (
              <div className="flex justify-center mt-10">
                <Link
                  href="/videos"
                  className="font-body text-sm tracking-wider border border-[#EBE5DC] px-8 py-3 text-[#5C4D3C] hover:border-[#C9A871] hover:text-[#1A1410] transition-all duration-300"
                >
                  לכל סוגי השיעורים →
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 border border-[#EBE5DC] bg-[#FDFCFA]">
            <div className="w-8 h-px bg-[#C9A871] mx-auto mb-8" />
            <h3 className="font-heading text-2xl font-light text-[#1A1410] mb-4">
              בקרוב — סוגי שיעורים חדשים
            </h3>
            <p className="font-body text-sm text-[#A39888]">
              נועה עובדת על הוספת סוגי שיעורים חדשים ומרגשים
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
