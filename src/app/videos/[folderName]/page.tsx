import { getCurrentUserProfile } from '@/lib/auth-helpers'
import Link from 'next/link'
import Image from 'next/image'
import { PlayIcon, FolderIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ folderName: string }>
}

export default async function FolderPage({ params }: Props) {
  await getCurrentUserProfile()
  const { folderName } = await params
  const decodedFolderName = decodeURIComponent(folderName)

  // Fetch folder contents - use absolute URL with current origin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let folderData: any = null
  try {
    // Build the API URL - need full URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'https://studio-noa-pilates.vercel.app')
    
    const apiUrl = `${baseUrl}/api/folders/${folderName}`
    console.log('🔍 Fetching folder data from:', apiUrl)
    console.log('📝 folderName:', folderName, 'decoded:', decodedFolderName)
    
    const response = await fetch(apiUrl, { cache: 'no-store' })
    
    if (!response.ok) {
      return notFound()
    }
    
    folderData = await response.json()
  } catch (error) {
    console.error('Error fetching folder:', error)
    return notFound()
  }

  const { folder, subfolders = [], videos = [] } = folderData

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-background py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/videos"
            className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5" />
            <span>חזרה לכל הסגנונות</span>
          </Link>
        </div>

        {/* Folder Header */}
        <div 
          className="rounded-3xl p-8 mb-12 shadow-strong"
          style={{ backgroundColor: folder.metadata.colorTheme || '#FFE6D6' }}
        >
          <h1 className="text-5xl font-bold text-black mb-4">
            {decodedFolderName}
          </h1>
          <p className="text-xl text-black/70 mb-6">
            {folder.metadata.description}
          </p>
          <div className="flex items-center gap-6 text-black/60">
            <div className="flex items-center gap-2">
              <PlayIcon className="w-5 h-5" />
              <span>{videos.length} סרטונים</span>
            </div>
            {subfolders.length > 0 && (
              <div className="flex items-center gap-2">
                <FolderIcon className="w-5 h-5" />
                <span>{subfolders.length} תת-תיקיות</span>
              </div>
            )}
          </div>
        </div>

        {/* Subfolders */}
        {subfolders.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">תת-תיקיות</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {subfolders.map((subfolder: any) => (
                <Link
                  key={subfolder.uri}
                  href={`/videos/${encodeURIComponent(subfolder.name)}`}
                  className="group block"
                >
                  <div
                    className="relative overflow-hidden rounded-2xl shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1 p-6"
                    style={{ backgroundColor: subfolder.metadata.colorTheme || '#F7F3EB' }}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                        <FolderIcon className="w-6 h-6 text-black/70" />
                      </div>
                      <h3 className="text-xl font-bold text-black flex-1">
                        {subfolder.name}
                      </h3>
                    </div>
                    <p className="text-black/70 text-sm mb-3 line-clamp-2">
                      {subfolder.metadata.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-black/60">
                      <span>{subfolder.videoCount} שיעורים</span>
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">שיעורים</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {videos.map((video: any) => {
                // Extract Vimeo ID from URI
                const vimeoId = video.uri.split('/').pop()
                const thumbnail = video.pictures?.sizes?.[3]?.link || '/img/placeholder.jpg'

                return (
                  <Link
                    key={video.uri}
                    href={`/videos/${encodeURIComponent(decodedFolderName)}/${vimeoId}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1 bg-white">
                      {/* Thumbnail */}
                      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary-light to-sage-light">
                        <Image
                          src={thumbnail}
                          alt={video.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
                            <PlayIcon className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
                          {video.name}
                        </h3>
                        {video.description && (
                          <p className="text-sm text-black/60 mb-3 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        {video.duration && (
                          <div className="flex items-center gap-1 text-sm text-black/50">
                            <ClockIcon className="w-4 h-4" />
                            <span>{Math.floor(video.duration / 60)} דקות</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {videos.length === 0 && subfolders.length === 0 && (
          <div className="text-center py-16">
            <FolderIcon className="w-16 h-16 text-black/20 mx-auto mb-4" />
            <p className="text-xl text-black/50">התיקייה ריקה כרגע</p>
          </div>
        )}
      </div>
    </div>
  )
}
