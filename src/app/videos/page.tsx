// דף סוגי שיעורים - תצוגת תיקיות Vimeo
import { getCurrentUserProfile } from '@/lib/auth-helpers'
import Link from 'next/link'
import Image from 'next/image'

export default async function VideosPage() {
  const profile = await getCurrentUserProfile()

  // משיכת תיקיות ישירות מ-Vimeo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let folders: any[] = []
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    (typeof window !== 'undefined' ? window.location.origin : 'https://studio-noa-pilates.vercel.app')
    const apiUrl = `${baseUrl}/api/folders`
    
    console.log('[Videos Page] Fetching folders from:', apiUrl)
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    })
    console.log('[Videos Page] Response status:', response.status)
    
    const data = await response.json()
    console.log('[Videos Page] Data received:', data)
    
    folders = data.folders || []
    console.log('[Videos Page] Folders count:', folders.length)
  } catch (error) {
    console.error('[Videos Page] Error fetching folders:', error)
  }

  const foldersWithCount = folders

  return (
    <main className="min-h-screen bg-[#FDFCFA]">

      {/* Compact Header */}
      <section className="pt-10 pb-6 border-b border-[#EBE5DC]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 flex items-end justify-between">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-light text-[#1A1410]">
              סוגי השיעורים
            </h1>
            <p className="font-body text-sm text-[#A39888] mt-1">
              בחרי את סוג השיעור שמדבר אלייך
            </p>
          </div>
          {!profile && (
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center bg-[#1A1410] text-[#FDFCFA] font-body text-xs tracking-wider px-6 py-3 hover:bg-[#C9A871] transition-colors duration-300"
            >
              התחילי מסע
            </Link>
          )}
        </div>
      </section>

      {/* Folders Grid */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12">
          {foldersWithCount && foldersWithCount.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {foldersWithCount.map((folder, index) => (
                <Link
                  key={folder.uri}
                  href={`/videos/${encodeURIComponent(folder.name)}`}
                  className="group block border border-[#EBE5DC] -mt-px -mr-px overflow-hidden fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* Image area */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#EBE5DC]">
                    {folder.image_url ? (
                      <Image
                        src={folder.image_url}
                        alt={folder.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-heading text-5xl font-light text-[#C4BAA8]">
                          {folder.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#1A1410]/0 group-hover:bg-[#1A1410]/20 transition-colors duration-500" />
                  </div>

                  {/* Text area */}
                  <div className="p-6 sm:p-8 group-hover:bg-[#F5EFE6] transition-colors duration-300">
                    <h3 className="font-heading text-xl md:text-2xl font-light text-[#1A1410] mb-2 group-hover:text-[#C9A871] transition-colors duration-300">
                      {folder.name}
                    </h3>

                    {(folder.subtitle || folder.metadata?.description) && (
                      <p className="font-body text-sm leading-6 text-[#5C4D3C] mb-4 line-clamp-2">
                        {folder.subtitle || folder.metadata?.description}
                      </p>
                    )}

                    <div className="w-0 h-px bg-[#C9A871] group-hover:w-10 transition-all duration-500" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-[#EBE5DC]">
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
    </main>
  )
}
