'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface FolderFromVimeo {
  name: string
  videoCount: number
  subfolderCount: number
  totalVideoCount: number
  subfolders?: SubfolderFromVimeo[]
}

interface SubfolderFromVimeo {
  name: string
  videoCount: number
}

interface FolderSetting {
  folder_name: string
  subtitle: string
  sort_order: number
  image_url?: string | null
}

export default function AdminFoldersPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const [folders, setFolders] = useState<FolderFromVimeo[]>([])
  const [settings, setSettings] = useState<Record<string, FolderSetting>>({})
  const [editingSubtitles, setEditingSubtitles] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const supabase = createClient()

  // Check admin access
  useEffect(() => {
    if (profile && !(profile as { is_admin?: boolean }).is_admin && 
        (profile as { subscription_id?: string }).subscription_id !== 'Admin') {
      router.push('/')
    }
  }, [profile, router])

  // Fetch folders from Vimeo + settings from DB
  useEffect(() => {
    async function fetchData() {
      try {
        const [foldersRes, settingsRes] = await Promise.all([
          fetch('/api/folders'),
          fetch('/api/admin/folder-settings')
        ])

        const foldersData = await foldersRes.json()
        const settingsData = await settingsRes.json()

        const topFolders: FolderFromVimeo[] = foldersData.folders || []

        // Fetch subfolders for each folder that has them
        const foldersWithSubs = await Promise.all(
          topFolders.map(async (folder) => {
            if (folder.subfolderCount > 0) {
              try {
                const subRes = await fetch(`/api/folders/${encodeURIComponent(folder.name)}`)
                const subData = await subRes.json()
                return { ...folder, subfolders: subData.subfolders || [] }
              } catch {
                return folder
              }
            }
            return folder
          })
        )

        setFolders(foldersWithSubs)

        // Map settings by folder_name
        const settingsMap: Record<string, FolderSetting> = {}
        const subtitles: Record<string, string> = {}
        for (const s of settingsData.settings || []) {
          settingsMap[s.folder_name] = s
          subtitles[s.folder_name] = s.subtitle || ''
        }
        setSettings(settingsMap)
        setEditingSubtitles(subtitles)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('שגיאה בטעינת נתונים')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const safeFolderKey = (name: string): string => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash).toString(36)
  }

  const handleImageDelete = async (folderName: string) => {
    if (!confirm(`למחוק את התמונה של "${folderName}"?`)) return
    try {
      const response = await fetch('/api/admin/folder-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder_name: folderName,
          subtitle: editingSubtitles[folderName] || settings[folderName]?.subtitle || '',
          sort_order: settings[folderName]?.sort_order ?? 50,
          image_url: null
        })
      })
      if (!response.ok) throw new Error('Failed to save')
      const data = await response.json()
      setSettings(prev => ({ ...prev, [folderName]: data.setting }))
      toast.success('תמונה נמחקה')
    } catch {
      toast.error('שגיאה במחיקת תמונה')
    }
  }

  const handleImageUpload = async (folderName: string, file: File) => {
    if (!file) return
    setUploadingImage(folderName)
    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `folders/${safeFolderKey(folderName)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('folder-images')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('folder-images')
        .getPublicUrl(path)

      const imageUrl = urlData.publicUrl

      const response = await fetch('/api/admin/folder-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder_name: folderName,
          subtitle: editingSubtitles[folderName] || settings[folderName]?.subtitle || '',
          sort_order: settings[folderName]?.sort_order ?? 50,
          image_url: imageUrl
        })
      })

      if (!response.ok) throw new Error('Failed to save')
      const data = await response.json()
      setSettings(prev => ({ ...prev, [folderName]: data.setting }))
      toast.success(`תמונה עודכנה עבור "${folderName}"`)
    } catch (err) {
      console.error(err)
      toast.error('שגיאה בהעלאת תמונה')
    } finally {
      setUploadingImage(null)
    }
  }

  const handleSave = async (folderName: string) => {
    setSaving(folderName)
    try {
      const response = await fetch('/api/admin/folder-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder_name: folderName,
          subtitle: editingSubtitles[folderName] || '',
          sort_order: settings[folderName]?.sort_order ?? 50
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      const data = await response.json()
      setSettings(prev => ({
        ...prev,
        [folderName]: data.setting
      }))
      toast.success(`"${folderName}" נשמר בהצלחה`)
    } catch {
      toast.error('שגיאה בשמירה')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center" dir="rtl">
        <p className="font-body text-[#A39888]">טוען...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]" dir="rtl">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-12 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/admin" className="font-body text-xs tracking-[0.15em] uppercase text-[#A39888] hover:text-[#C9A871] transition-colors mb-4 block">
            ← חזרה לניהול
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-light text-[#1A1410] mb-2">
            ניהול תיקיות
          </h1>
          <p className="font-body text-sm text-[#5C4D3C]">
            ערכי כותרת משנית לכל תיקייה. השם הראשי נלקח אוטומטית מ-Vimeo.
          </p>
        </div>

        {/* Folders list */}
        <div className="space-y-4">
          {folders.map((folder) => {
            const currentSubtitle = editingSubtitles[folder.name] ?? settings[folder.name]?.subtitle ?? ''
            const hasChanged = currentSubtitle !== (settings[folder.name]?.subtitle || '')
            const isSaving = saving === folder.name

            return (
              <div
                key={folder.name}
                className="border border-[#EBE5DC]"
              >
                {/* Main folder */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-xl font-light text-[#1A1410]">
                      {folder.name}
                    </h3>
                    <span className="font-body text-xs text-[#A39888]">
                      {folder.totalVideoCount} שיעורים
                      {folder.subfolderCount > 0 && ` · ${folder.subfolderCount} קטגוריות`}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Image upload */}
                    <div className="shrink-0">
                      <label className="font-body text-xs text-[#A39888] mb-2 block">תמונה</label>
                      <div
                        className="w-24 h-24 border border-[#EBE5DC] flex items-center justify-center cursor-pointer hover:border-[#C9A871] transition-colors overflow-hidden relative bg-[#FAF8F3]"
                        onClick={() => fileInputRefs.current[folder.name]?.click()}
                      >
                        {settings[folder.name]?.image_url ? (
                          <Image
                            src={settings[folder.name].image_url!}
                            alt={folder.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="font-body text-[10px] text-[#A39888] text-center px-2">
                            {uploadingImage === folder.name ? 'מעלה...' : 'לחצי להעלאה'}
                          </span>
                        )}
                        {uploadingImage === folder.name && (
                          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <span className="font-body text-[10px] text-[#A39888]">מעלה...</span>
                          </div>
                        )}
                      </div>
                      <input
                        ref={el => { fileInputRefs.current[folder.name] = el }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(folder.name, file)
                        }}
                      />
                      {settings[folder.name]?.image_url && (
                        <div className="flex gap-3 mt-1">
                          <button
                            onClick={() => fileInputRefs.current[folder.name]?.click()}
                            className="font-body text-[10px] text-[#A39888] hover:text-[#C9A871] transition-colors"
                          >
                            החלף
                          </button>
                          <button
                            onClick={() => handleImageDelete(folder.name)}
                            className="font-body text-[10px] text-[#A39888] hover:text-red-400 transition-colors"
                          >
                            מחק
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Subtitle input */}
                    <div className="flex-1">
                      <div className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="font-body text-xs text-[#A39888] mb-1 block">כותרת משנית</label>
                          <input
                            type="text"
                            value={currentSubtitle}
                            onChange={(e) => setEditingSubtitles(prev => ({
                              ...prev,
                              [folder.name]: e.target.value
                            }))}
                            placeholder="למשל: תרגילי נשימה לשחרור ורגיעה"
                            className="w-full font-body text-sm text-[#1A1410] border border-[#EBE5DC] px-4 py-3 bg-transparent focus:border-[#C9A871] focus:outline-none transition-colors"
                          />
                        </div>
                        <button
                          onClick={() => handleSave(folder.name)}
                          disabled={!hasChanged || isSaving}
                          className={`font-body text-sm px-6 py-3 transition-colors ${
                            hasChanged && !isSaving
                              ? 'bg-[#1A1410] text-[#FDFCFA] hover:bg-[#C9A871]'
                              : 'bg-[#EBE5DC] text-[#A39888] cursor-not-allowed'
                          }`}
                        >
                          {isSaving ? '...' : 'שמור'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subfolders Accordion */}
                {folder.subfolders && folder.subfolders.length > 0 && (
                  <div className="border-t border-[#EBE5DC]">
                    <button
                      onClick={() => setExpandedFolders(prev => {
                        const next = new Set(prev)
                        if (next.has(folder.name)) {
                          next.delete(folder.name)
                        } else {
                          next.add(folder.name)
                        }
                        return next
                      })}
                      className="w-full flex items-center justify-between px-6 sm:px-8 py-4 bg-[#FAF8F3] hover:bg-[#F5EFE6] transition-colors"
                    >
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#A39888]">
                        תת-קטגוריות ({folder.subfolders.length})
                      </p>
                      <svg
                        className={`w-4 h-4 text-[#A39888] transition-transform duration-300 ${expandedFolders.has(folder.name) ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFolders.has(folder.name) && folder.subfolders.map((sub) => {
                      const subSubtitle = editingSubtitles[sub.name] ?? settings[sub.name]?.subtitle ?? ''
                      const subHasChanged = subSubtitle !== (settings[sub.name]?.subtitle || '')
                      const subIsSaving = saving === sub.name

                      return (
                        <div key={sub.name} className="px-6 sm:px-8 py-4 border-t border-[#EBE5DC]/60">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-body text-sm text-[#5C4D3C]">
                              ↳ {sub.name}
                            </h4>
                            <span className="font-body text-[10px] text-[#A39888]">
                              {sub.videoCount} שיעורים
                            </span>
                          </div>
                          <div className="flex gap-3 items-end">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={subSubtitle}
                                onChange={(e) => setEditingSubtitles(prev => ({
                                  ...prev,
                                  [sub.name]: e.target.value
                                }))}
                                placeholder="כותרת משנית לתת-קטגוריה..."
                                className="w-full font-body text-xs text-[#1A1410] border border-[#EBE5DC] px-3 py-2 bg-white focus:border-[#C9A871] focus:outline-none transition-colors"
                              />
                            </div>
                            <button
                              onClick={() => handleSave(sub.name)}
                              disabled={!subHasChanged || subIsSaving}
                              className={`font-body text-xs px-4 py-2 transition-colors ${
                                subHasChanged && !subIsSaving
                                  ? 'bg-[#1A1410] text-[#FDFCFA] hover:bg-[#C9A871]'
                                  : 'bg-[#EBE5DC] text-[#A39888] cursor-not-allowed'
                              }`}
                            >
                              {subIsSaving ? '...' : 'שמור'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {folders.length === 0 && (
          <div className="text-center py-20 border border-[#EBE5DC]">
            <p className="font-body text-sm text-[#A39888]">לא נמצאו תיקיות ב-Vimeo</p>
          </div>
        )}
      </div>
    </div>
  )
}
