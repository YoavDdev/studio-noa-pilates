// דף סגנונות פילאטיס - תצוגת תיקיות Vimeo
import { getCurrentUserProfile } from '@/lib/auth-helpers'
import Link from 'next/link'

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
              הסגנונות
            </h1>
            <p className="font-body text-sm text-[#A39888] mt-1">
              בחרי את הסגנון שמדבר אלייך
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
                  className="group block border border-[#EBE5DC] -mt-px -mr-px hover:bg-[#F5EFE6] transition-colors duration-500 fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="p-8 sm:p-10 md:p-12">
                    <h3 className="font-heading text-2xl md:text-3xl font-light text-[#1A1410] mb-3 group-hover:text-[#C9A871] transition-colors duration-300">
                      {folder.name}
                    </h3>

                    {(folder.subtitle || folder.metadata.description) && (
                      <p className="font-body text-sm leading-7 text-[#5C4D3C] mb-6 line-clamp-2">
                        {folder.subtitle || folder.metadata.description}
                      </p>
                    )}

                    {/* Gold line accent */}
                    <div className="w-0 h-px bg-[#C9A871] group-hover:w-12 transition-all duration-500" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-[#EBE5DC]">
              <div className="w-8 h-px bg-[#C9A871] mx-auto mb-8" />
              <h3 className="font-heading text-2xl font-light text-[#1A1410] mb-4">
                בקרוב — סגנונות חדשים
              </h3>
              <p className="font-body text-sm text-[#A39888]">
                נועה עובדת על הוספת סגנונות חדשים ומרגשים
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
