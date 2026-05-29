import { NextResponse } from 'next/server'
import { getFolderMetadata } from '@/config/folder-metadata'
import { createClient } from '@/lib/supabase/server'

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

    // Map all Vimeo folders with debug info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allFoldersDebug = vimeoFolders.map((folder: any) => {
      const ancestorPath = folder.metadata?.connections?.ancestor_path || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ancestors = ancestorPath.map((a: any) => a.name)
      return {
        name: folder.name,
        uri: folder.uri,
        ancestors,
        ancestorCount: ancestorPath.length,
        videoCount: folder.metadata?.connections?.videos?.total || 0,
      }
    })

    console.log('[Folders API] === RAW VIMEO DATA ===')
    allFoldersDebug.forEach((f: { name: string; ancestors: string[]; ancestorCount: number; videoCount: number }) => {
      console.log(`  "${f.name}" → ancestors: [${f.ancestors.join(' > ')}] (${f.ancestorCount}) | videos: ${f.videoCount}`)
    })

    // Combine Vimeo folders with metadata
    const foldersWithMetadata = vimeoFolders.map((folder: any) => {
      const metadata = getFolderMetadata(folder.name)
      const videoCount = folder.metadata?.connections?.videos?.total || 0
      const ancestorPath = folder.metadata?.connections?.ancestor_path || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ancestors = ancestorPath.map((a: any) => a.name)
      
      // Top-level = no ancestors OR only ancestor is "My library"
      // If ancestor is another folder name → it's a subfolder
      const isTopLevel = ancestorPath.length === 0 || 
        (ancestorPath.length === 1 && ancestors[0] === 'My library')
      
      return {
        uri: folder.uri,
        name: folder.name,
        created_time: folder.created_time,
        modified_time: folder.modified_time,
        metadata,
        videoCount,
        isTopLevel,
        ancestors,
        isVisible: metadata.isVisible
      }
    })

    // Show ALL top-level folders (no isVisible filter)
    // Deduplicate by name, skip "My library" itself
    const seen = new Set<string>()
    const visibleFolders = foldersWithMetadata
      .filter((f: { isTopLevel: boolean; name: string; ancestors: string[] }) => {
        if (f.name === 'My library') return false
        if (!f.isTopLevel) return false
        if (seen.has(f.name)) return false
        seen.add(f.name)
        return true
      })
      .sort((a: { metadata: { order: number } }, b: { metadata: { order: number } }) => a.metadata.order - b.metadata.order)

    // Enrich each folder with subfolder count + total videos (including subfolder videos)
    const enrichedFolders = visibleFolders.map((folder: { name: string; videoCount: number; [key: string]: unknown }) => {
      // Find subfolders whose first ancestor is this folder
      const subfolders = foldersWithMetadata.filter(
        (f: { ancestors: string[]; name: string }) => f.ancestors[0] === folder.name
      )
      const subfolderCount = subfolders.length
      const subfolderNames = subfolders.map((f: { name: string }) => f.name)
      const subfolderVideoCount = subfolders.reduce(
        (sum: number, f: { videoCount: number }) => sum + f.videoCount, 0
      )
      return {
        ...folder,
        subfolderCount,
        subfolderNames,
        totalVideoCount: folder.videoCount + subfolderVideoCount
      }
    })

    // Fetch folder_settings from DB (subtitles + sort order)
    let dbSettings: Record<string, { subtitle: string; sort_order: number }> = {}
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('folder_settings')
        .select('folder_name, subtitle, sort_order')
      
      if (data) {
        for (const row of data) {
          dbSettings[row.folder_name] = { subtitle: row.subtitle, sort_order: row.sort_order }
        }
      }
    } catch (e) {
      console.log('[Folders API] No folder_settings table yet, using defaults')
    }

    // Merge DB settings into folders
    const finalFolders = enrichedFolders.map((folder: { name: string; metadata: { order: number; description: string }; [key: string]: unknown }) => {
      const dbSetting = dbSettings[folder.name]
      return {
        ...folder,
        subtitle: dbSetting?.subtitle || folder.metadata.description || '',
        sortOrder: dbSetting?.sort_order ?? folder.metadata.order ?? 50
      }
    }).sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder)
    
    console.log(`[Folders API] Showing ${finalFolders.length} top-level folders`)

    return NextResponse.json({
      success: true,
      folders: finalFolders,
      total: finalFolders.length
    })

  } catch (error) {
    console.error('Error fetching folders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    )
  }
}
