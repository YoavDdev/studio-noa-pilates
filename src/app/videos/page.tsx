// דף סגנונות פילאטיס - תצוגת תיקיות Vimeo
import { getCurrentUserProfile } from '@/lib/auth-helpers'
import Link from 'next/link'
import { PlayIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/outline'

export default async function VideosPage() {
  const profile = await getCurrentUserProfile()

  // משיכת תיקיות ישירות מ-Vimeo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let folders: any[] = []
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/folders`, {
      cache: 'no-store'
    })
    const data = await response.json()
    folders = data.folders || []
  } catch (error) {
    console.error('Error fetching folders:', error)
  }

  const foldersWithCount = folders

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-background py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            סגנונות הפילאטיס שלי
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            כל סגנון הוא מסע ייחודי - בחרי את הסגנון שמדבר אלייך היום
          </p>
          {!profile && (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary via-primary-dark to-primary text-black font-bold rounded-full hover:shadow-strong transition-all hover:scale-105"
            >
              <SparklesIcon className="w-5 h-5" />
              התחילי את המסע שלך
            </Link>
          )}
        </div>

        {/* Styles Grid */}
        {foldersWithCount && foldersWithCount.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foldersWithCount.map((folder, index) => (
              <Link
                key={folder.uri}
                href={`/videos/${encodeURIComponent(folder.name)}`}
                className="group block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="relative overflow-hidden rounded-3xl shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-2"
                  style={{ backgroundColor: folder.metadata.colorTheme || '#FFE6D6' }}
                >
                  {/* Cover Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary-light via-sage-light/30 to-primary flex items-center justify-center">
                      <PlayIcon className="w-24 h-24 text-white/50" />
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-black mb-2">
                      {folder.name}
                    </h3>
                    {folder.metadata.description && (
                      <p className="text-black/70 mb-4 line-clamp-2">
                        {folder.metadata.description}
                      </p>
                    )}
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-black/60 mb-4">
                      {folder.videoCount > 0 && (
                        <div className="flex items-center gap-1">
                          <PlayIcon className="w-4 h-4" />
                          <span>{folder.videoCount} שיעורים</span>
                        </div>
                      )}
                      {folder.metadata.level && folder.metadata.level !== 'all' && (
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4" />
                          <span>{folder.metadata.levelHebrew}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-black font-semibold group-hover:gap-3 flex items-center gap-2 transition-all">
                        צפי בשיעורים
                        <PlayIcon className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-light mb-6">
              <PlayIcon className="w-10 h-10 text-sage" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              בקרוב - סגנונות חדשים!
            </h3>
            <p className="text-text-secondary">
              נועה עובדת על הוספת סגנונות חדשים ומרגשים
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
