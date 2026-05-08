// Vimeo API integration for Studio Noa Pilates
// Handles private video access with authentication

const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN
const VIMEO_API_BASE = 'https://api.vimeo.com'

export interface VimeoVideo {
  uri: string
  name: string
  description: string
  duration: number
  privacy: {
    view: string
    embed: string
  }
  embed: {
    html: string
  }
  player_embed_url: string
  pictures: {
    sizes: Array<{
      width: number
      height: number
      link: string
    }>
  }
}

// Get video details from Vimeo API
export async function getVimeoVideo(videoId: string): Promise<VimeoVideo | null> {
  if (!VIMEO_ACCESS_TOKEN) {
    console.error('Vimeo access token not configured')
    return null
  }

  try {
    const response = await fetch(`${VIMEO_API_BASE}/videos/${videoId}`, {
      headers: {
        'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Vimeo API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Vimeo video:', error)
    return null
  }
}

// Generate secure embed URL for authenticated users
export function getSecureVimeoUrl(videoId: string, userToken?: string): string {
  // For private videos, we need to use the player embed URL
  // This will be restricted by domain and user authentication
  const baseUrl = `https://player.vimeo.com/video/${videoId}`
  
  const params = new URLSearchParams({
    // Add security parameters
    autopause: '0',
    player_id: '0',
    app_id: process.env.NEXT_PUBLIC_VIMEO_APP_ID || '',
  })

  // Add user authentication if available
  if (userToken) {
    params.append('h', userToken) // Vimeo private hash
  }

  return `${baseUrl}?${params.toString()}`
}

// Check if user has access to private video (מערכת מנויים חדשה)
export function canAccessVimeoVideo(
  isVideoPremium: boolean,
  userType: string | null,
  subscriptionId: string | null,
  trialStartDate: string | null
): boolean {
  // Free videos are always accessible
  if (!isVideoPremium) return true
  
  // Admin - full access
  if (subscriptionId === 'Admin' || userType === 'admin') return true
  
  // Active PayPal subscription
  if (subscriptionId && subscriptionId.startsWith('I-')) return true
  
  // Trial period (30 days)
  if ((subscriptionId === 'Trial' || userType === 'trial') && trialStartDate) {
    const trialStart = new Date(trialStartDate)
    const now = new Date()
    const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24))
    return daysPassed < 30
  }
  
  return false
}

// Get Vimeo thumbnail URL
export function getVimeoThumbnail(videoId: string, width: number = 640): string {
  return `https://vumbnail.com/${videoId}_${width}x${Math.floor(width * 0.5625)}.jpg`
}

// ========================================
// פונקציות סנכרון מ-Vimeo
// ========================================

export interface VimeoFolder {
  uri: string
  name: string
  metadata: {
    connections: {
      videos: {
        total: number
        uri: string
      }
    }
  }
}

// Get all folders from Vimeo
export async function getVimeoFolders(): Promise<VimeoFolder[]> {
  if (!VIMEO_ACCESS_TOKEN) {
    console.error('Vimeo access token not configured')
    return []
  }

  try {
    const response = await fetch(`${VIMEO_API_BASE}/me/projects`, {
      headers: {
        'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Vimeo API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Vimeo folders:', error)
    return []
  }
}

// Get all videos from a specific folder
export async function getVideosFromFolder(folderUri: string): Promise<VimeoVideo[]> {
  if (!VIMEO_ACCESS_TOKEN) {
    console.error('Vimeo access token not configured')
    return []
  }

  try {
    const response = await fetch(`${VIMEO_API_BASE}${folderUri}/videos`, {
      headers: {
        'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Vimeo API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching videos from folder:', error)
    return []
  }
}

// Get all videos from user account
export async function getAllVimeoVideos(): Promise<VimeoVideo[]> {
  if (!VIMEO_ACCESS_TOKEN) {
    console.error('Vimeo access token not configured')
    return []
  }

  try {
    const response = await fetch(`${VIMEO_API_BASE}/me/videos?per_page=100`, {
      headers: {
        'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Vimeo API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching all Vimeo videos:', error)
    return []
  }
}

// Extract video ID from Vimeo URI
export function extractVimeoId(uri: string): string {
  return uri.replace('/videos/', '')
}
