import { getCurrentUserProfile } from '@/lib/auth-helpers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FolderVideosGrid from '@/components/FolderVideosGrid'

interface Props {
  params: Promise<{ folderName: string }>
}

export default async function FolderPage({ params }: Props) {
  await getCurrentUserProfile()
  const { folderName } = await params
  const decodedFolderName = decodeURIComponent(folderName)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let folderData: any = null
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'https://studio-noa-pilates.vercel.app')
    
    const apiUrl = `${baseUrl}/api/folders/${folderName}`
    const response = await fetch(apiUrl, { cache: 'no-store' })
    
    if (!response.ok) {
      return notFound()
    }
    
    folderData = await response.json()
  } catch (error) {
    console.error('Error fetching folder:', error)
    return notFound()
  }

  const { folder, subfolders = [], allVideos = [], videos = [] } = folderData
  const videosToShow = allVideos.length > 0 ? allVideos : videos

  return (
    <main className="min-h-screen bg-[#FDFCFA]">

      {/* Compact Header */}
      <section className="pt-8 pb-5 border-b border-[#EBE5DC]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12">
          <div className="mb-4">
            <Link 
              href="/videos"
              className="font-body text-xs tracking-[0.15em] uppercase text-[#A39888] hover:text-[#C9A871] transition-colors"
            >
              ← כל הסגנונות
            </Link>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-light text-[#1A1410]">
                {decodedFolderName}
              </h1>
              {(folder.subtitle || folder.metadata.description) && (
                <p className="font-body text-sm text-[#5C4D3C] mt-1">
                  {folder.subtitle || folder.metadata.description}
                </p>
              )}
            </div>
            <span className="font-body text-xs text-[#A39888] whitespace-nowrap">
              {videosToShow.length} שיעורים
            </span>
          </div>
        </div>
      </section>

      {/* Filter strip + Videos grid (client component) */}
      {videosToShow.length > 0 ? (
        <FolderVideosGrid
          folderName={decodedFolderName}
          allVideos={videosToShow}
          subfolders={subfolders}
        />
      ) : (
        <section className="section-padding">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 text-center">
            <div className="w-8 h-px bg-[#C9A871] mx-auto mb-8" />
            <p className="font-heading text-xl font-light text-[#A39888]">התיקייה ריקה כרגע</p>
          </div>
        </section>
      )}
    </main>
  )
}
