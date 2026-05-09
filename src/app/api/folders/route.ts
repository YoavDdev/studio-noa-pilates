import { NextResponse } from 'next/server'
import { getFolderMetadata } from '@/config/folder-metadata'

const VIMEO_API_URL = 'https://api.vimeo.com'
const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN

export const dynamic = 'force-dynamic'

// Fetch folders from Vimeo and combine with metadata
export async function GET() {
  try {
    if (!VIMEO_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Vimeo access token not configured' },
        { status: 500 }
      )
    }

    // Fetch folders from Vimeo
    const response = await fetch(`${VIMEO_API_URL}/me/projects?per_page=100`, {
      headers: {
        'Authorization': `bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      throw new Error(`Vimeo API error: ${response.status}`)
    }

    const data = await response.json()
    const vimeoFolders = data.data || []

    // Combine Vimeo folders with metadata
    const foldersWithMetadata = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vimeoFolders.map(async (folder: any) => {
        const metadata = getFolderMetadata(folder.name)
        
        // Get video count from Vimeo
        const videoCount = folder.metadata?.connections?.videos?.total || 0
        
        // Check if folder is directly under My library
        const ancestorPath = folder.metadata?.connections?.ancestor_path || []
        const isUnderMyLibrary = ancestorPath.length === 1 && ancestorPath[0]?.name === 'My library'
        
        return {
          uri: folder.uri,
          name: folder.name,
          created_time: folder.created_time,
          modified_time: folder.modified_time,
          metadata,
          videoCount,
          isUnderMyLibrary,
          // Only show if marked as visible in config
          isVisible: metadata.isVisible
        }
      })
    )

    // Filter to only folders under My library that are marked visible, then sort by order
    const visibleFolders = foldersWithMetadata
      .filter(f => f.isVisible && f.isUnderMyLibrary)
      .sort((a, b) => a.metadata.order - b.metadata.order)

    return NextResponse.json({
      success: true,
      folders: visibleFolders,
      total: visibleFolders.length
    })

  } catch (error) {
    console.error('Error fetching folders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    )
  }
}
