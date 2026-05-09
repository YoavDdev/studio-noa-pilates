import { NextRequest, NextResponse } from 'next/server'
import { getFolderMetadata } from '@/config/folder-metadata'

const VIMEO_API_URL = 'https://api.vimeo.com'
const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN

export const dynamic = 'force-dynamic'

// Get folder contents (subfolders + videos)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folderName: string }> }
) {
  try {
    const { folderName } = await params
    const decodedFolderName = decodeURIComponent(folderName)
    
    console.log('📁 API /folders/[folderName] called with:', {
      folderName,
      decodedFolderName
    })

    if (!VIMEO_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Vimeo access token not configured' },
        { status: 500 }
      )
    }

    // First, get all folders to find the one we want
    const foldersResponse = await fetch(`${VIMEO_API_URL}/me/projects?per_page=100`, {
      headers: {
        'Authorization': `bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    })

    if (!foldersResponse.ok) {
      throw new Error(`Vimeo API error: ${foldersResponse.status}`)
    }

    const foldersData = await foldersResponse.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetFolder = foldersData.data?.find((f: any) => f.name === decodedFolderName)

    if (!targetFolder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }

    const metadata = getFolderMetadata(decodedFolderName)

    // Get videos in this folder
    const videosResponse = await fetch(`${VIMEO_API_URL}${targetFolder.uri}/videos?per_page=100`, {
      headers: {
        'Authorization': `bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    })

    const videosData = videosResponse.ok ? await videosResponse.json() : { data: [] }
    const videos = videosData.data || []

    // Get subfolders (folders that have this folder as parent)
    const allFolders = foldersData.data || []
    console.log(`🔎 Looking for subfolders of: ${decodedFolderName}`)
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subfolders = allFolders.filter((folder: any) => {
      const ancestorPath = folder.metadata?.connections?.ancestor_path || []
      
      // Debug log
      if (folder.name.includes('חיזוק') || folder.name.includes('שחרור') || folder.name.includes('רצפה')) {
        console.log(`📂 Checking folder: ${folder.name}`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.log(`   ancestorPath:`, ancestorPath.map((a: any) => a.name))
      }
      
      // Check if this folder is a direct child
      if (ancestorPath.length < 2) return false
      
      // The parent is the FIRST in ancestor path (direct parent)
      // ancestorPath goes from child -> root, so [0] is the immediate parent
      const parentName = ancestorPath[0]?.name
      const isMatch = parentName === decodedFolderName
      
      if (isMatch) {
        console.log(`   ✅ Found subfolder: ${folder.name} (parent: ${parentName})`)
      }
      
      return isMatch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).map((folder: any) => {
      const subMetadata = getFolderMetadata(folder.name)
      return {
        uri: folder.uri,
        name: folder.name,
        videoCount: folder.metadata?.connections?.videos?.total || 0,
        metadata: subMetadata
      }
    })

    return NextResponse.json({
      success: true,
      folder: {
        uri: targetFolder.uri,
        name: targetFolder.name,
        metadata,
        videoCount: videos.length
      },
      subfolders,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      videos: videos.map((video: any) => ({
        uri: video.uri,
        name: video.name,
        description: video.description,
        duration: video.duration,
        pictures: video.pictures,
        created_time: video.created_time
      }))
    })

  } catch (error) {
    console.error('Error fetching folder contents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folder contents' },
      { status: 500 }
    )
  }
}
