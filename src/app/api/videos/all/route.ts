import { NextResponse } from 'next/server'

const VIMEO_API_URL = 'https://api.vimeo.com'
const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN

export const dynamic = 'force-dynamic'

// Fetch ALL videos from all folders, sorted newest first
export async function GET() {
  try {
    if (!VIMEO_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Vimeo access token not configured' }, { status: 500 })
    }

    // Get all folders
    const foldersRes = await fetch(`${VIMEO_API_URL}/me/projects?per_page=100`, {
      headers: {
        'Authorization': `bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    })

    if (!foldersRes.ok) {
      throw new Error(`Vimeo folders API error: ${foldersRes.status}`)
    }

    const foldersData = await foldersRes.json()
    const folders = foldersData.data || []

    // Fetch videos from all folders in parallel
    const videoPromises = folders.map(async (folder: { uri: string; name: string }) => {
      try {
        const res = await fetch(`${VIMEO_API_URL}${folder.uri}/videos?per_page=100&sort=date&direction=desc`, {
          headers: {
            'Authorization': `bearer ${VIMEO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          next: { revalidate: 0 }
        })
        if (!res.ok) return []
        const data = await res.json()
        return (data.data || []).map((video: {
          uri: string
          name: string
          description: string | null
          duration: number
          pictures: unknown
          created_time: string
        }) => ({
          uri: video.uri,
          name: video.name,
          description: video.description,
          duration: video.duration,
          pictures: video.pictures,
          created_time: video.created_time,
          folderName: folder.name
        }))
      } catch {
        return []
      }
    })

    const videoArrays = await Promise.all(videoPromises)
    const allVideos = videoArrays.flat()

    // Deduplicate by URI (same video might appear in multiple folders)
    const seen = new Set<string>()
    const uniqueVideos = allVideos.filter((v: { uri: string }) => {
      if (seen.has(v.uri)) return false
      seen.add(v.uri)
      return true
    })

    // Sort newest first
    uniqueVideos.sort((a: { created_time: string }, b: { created_time: string }) => 
      new Date(b.created_time).getTime() - new Date(a.created_time).getTime()
    )

    console.log(`[Videos All] Returning ${uniqueVideos.length} unique videos`)

    return NextResponse.json({
      success: true,
      videos: uniqueVideos,
      total: uniqueVideos.length
    })

  } catch (error) {
    console.error('Error fetching all videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}
