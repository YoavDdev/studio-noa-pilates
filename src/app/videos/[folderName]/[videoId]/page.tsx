import { getCurrentUserProfile, hasAccessToPremiumContent } from '@/lib/auth-helpers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: Promise<{
    folderName: string
    videoId: string
  }>
}

export default async function VideoPage({ params }: Props) {
  const profile = await getCurrentUserProfile()
  const { folderName, videoId } = await params
  const decodedFolderName = decodeURIComponent(folderName)

  if (!profile) {
    redirect('/login')
  }

  const hasAccess = await hasAccessToPremiumContent()

  if (!hasAccess) {
    redirect('/packages')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let videoData: any = null
  try {
    const response = await fetch(
      `https://api.vimeo.com/videos/${videoId}`,
      {
        headers: {
          'Authorization': `bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      return notFound()
    }

    videoData = await response.json()
  } catch (error) {
    console.error('Error fetching video:', error)
    return notFound()
  }

  return (
    <main className="min-h-screen bg-[#FDFCFA]">

      {/* Breadcrumb bar */}
      <div className="border-b border-[#EBE5DC]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 py-4">
          <div className="flex items-center gap-2 font-body text-xs tracking-wide text-[#A39888] overflow-x-auto whitespace-nowrap">
            <Link href="/videos" className="hover:text-[#C9A871] transition-colors">
              לכל סוגי השיעורים
            </Link>
            <span className="text-[#EBE5DC]">/</span>
            <Link 
              href={`/videos/${encodeURIComponent(decodedFolderName)}`}
              className="hover:text-[#C9A871] transition-colors"
            >
              {decodedFolderName}
            </Link>
            <span className="text-[#EBE5DC]">/</span>
            <span className="text-[#5C4D3C]">{videoData.name}</span>
          </div>
        </div>
      </div>

      {/* Player */}
      <section className="bg-[#1A1410]">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-video">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=${process.env.NEXT_PUBLIC_VIMEO_APP_ID}`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              title={videoData.name}
            />
          </div>
        </div>
      </section>

      {/* Video Info */}
      <section className="section-padding border-b border-[#EBE5DC]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12">
          <h1 className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] font-light text-[#1A1410] mb-4">
            {videoData.name}
          </h1>
          
          {videoData.description && (
            <p className="font-body text-[#5C4D3C] leading-8 mb-8 whitespace-pre-wrap max-w-3xl">
              {videoData.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 font-body text-xs text-[#A39888] pt-6 border-t border-[#EBE5DC]">
            {videoData.duration && (
              <div>
                <span className="text-[#5C4D3C]">משך</span>
                <span className="mx-2 text-[#EBE5DC]">·</span>
                {Math.floor(videoData.duration / 60)} דקות
              </div>
            )}
            {videoData.created_time && (
              <div>
                <span className="text-[#5C4D3C]">הועלה</span>
                <span className="mx-2 text-[#EBE5DC]">·</span>
                {new Date(videoData.created_time).toLocaleDateString('he-IL')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Back */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12">
          <Link
            href={`/videos/${encodeURIComponent(decodedFolderName)}`}
            className="inline-flex items-center gap-2 font-body text-sm text-[#5C4D3C] hover:text-[#C9A871] transition-colors"
          >
            ← חזרה ל{decodedFolderName}
          </Link>
        </div>
      </section>
    </main>
  )
}
