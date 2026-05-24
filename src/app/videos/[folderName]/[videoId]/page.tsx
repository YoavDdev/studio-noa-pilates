import { getCurrentUserProfile, hasAccessToPremiumContent } from '@/lib/auth-helpers'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
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

  // Check if user has access
  if (!profile) {
    redirect('/login')
  }

  // Check subscription status
  const hasAccess = await hasAccessToPremiumContent()

  if (!hasAccess) {
    redirect('/packages')
  }

  // Fetch video details from Vimeo
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-background py-6 sm:py-8 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm overflow-x-auto whitespace-nowrap pb-1">
          <Link 
            href="/videos"
            className="text-black/60 hover:text-black transition-colors"
          >
            כל הסגנונות
          </Link>
          <span className="text-black/40">/</span>
          <Link 
            href={`/videos/${encodeURIComponent(decodedFolderName)}`}
            className="text-black/60 hover:text-black transition-colors"
          >
            {decodedFolderName}
          </Link>
          <span className="text-black/40">/</span>
          <span className="text-black">{videoData.name}</span>
        </div>

        {/* Video Player */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-strong overflow-hidden mb-6 sm:mb-8">
          <div className="aspect-video bg-black">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=${process.env.NEXT_PUBLIC_VIMEO_APP_ID}`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              title={videoData.name}
            />
          </div>

          {/* Video Info */}
          <div className="p-5 sm:p-8">
            <h1 className="text-xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">
              {videoData.name}
            </h1>
            
            {videoData.description && (
              <div className="text-black/70 mb-6 whitespace-pre-wrap">
                {videoData.description}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-black/50 border-t border-black/10 pt-4 sm:pt-6">
              {videoData.duration && (
                <div>
                  <span className="font-semibold">משך: </span>
                  {Math.floor(videoData.duration / 60)} דקות
                </div>
              )}
              {videoData.created_time && (
                <div>
                  <span className="font-semibold">הועלה: </span>
                  {new Date(videoData.created_time).toLocaleDateString('he-IL')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link
          href={`/videos/${encodeURIComponent(decodedFolderName)}`}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-light text-black font-semibold rounded-full transition-colors shadow-medium hover:shadow-strong"
        >
          <ArrowRightIcon className="w-5 h-5" />
          <span>חזרה לתיקייה</span>
        </Link>
      </div>
    </div>
  )
}
