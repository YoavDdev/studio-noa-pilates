// API Route - סנכרון סרטונים מ-Vimeo ל-Supabase
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllVimeoVideos, extractVimeoId } from '@/lib/vimeo';
import { isAdmin } from '@/lib/auth-helpers';

export async function POST() {
  // בדיקת הרשאות Admin
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // משיכת כל הסרטונים מ-Vimeo
    const vimeoVideos = await getAllVimeoVideos();
    
    if (vimeoVideos.length === 0) {
      return NextResponse.json({ 
        error: 'No videos found in Vimeo or API connection failed' 
      }, { status: 400 });
    }

    const supabase = await createClient();
    const syncedVideos = [];
    const errors = [];

    // עבור על כל סרטון ושמור ב-Database
    for (const video of vimeoVideos) {
      try {
        const vimeoId = extractVimeoId(video.uri);
        
        // בדיקה אם הסרטון כבר קיים
        const { data: existing } = await supabase
          .from('videos')
          .select('id')
          .eq('vimeo_id', vimeoId)
          .single();

        const videoData = {
          vimeo_id: vimeoId,
          vimeo_uri: video.uri,
          title: video.name,
          description: video.description || null,
          thumbnail_url: video.pictures?.sizes?.[3]?.link || video.pictures?.sizes?.[0]?.link || null,
          duration: video.duration,
          is_premium: true, // ברירת מחדל - פרימיום
          last_synced_at: new Date().toISOString(),
        };

        if (existing) {
          // עדכון סרטון קיים
          const { error } = await supabase
            .from('videos')
            .update(videoData)
            .eq('vimeo_id', vimeoId);

          if (error) throw error;
          syncedVideos.push({ vimeoId, action: 'updated' });
        } else {
          // יצירת סרטון חדש
          const { error } = await supabase
            .from('videos')
            .insert(videoData);

          if (error) throw error;
          syncedVideos.push({ vimeoId, action: 'created' });
        }
      } catch (error: any) {
        errors.push({
          video: video.name,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `סונכרנו ${syncedVideos.length} סרטונים מ-Vimeo`,
      synced: syncedVideos.length,
      errors: errors.length,
      details: {
        syncedVideos,
        errors,
      },
    });
  } catch (error: any) {
    console.error('Vimeo sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync videos', details: error.message },
      { status: 500 }
    );
  }
}

// GET - בדיקת סטטוס
export async function GET() {
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  
  const { count: totalVideos } = await supabase
    .from('videos')
    .select('*', { count: 'exact', head: true });

  const { data: lastSynced } = await supabase
    .from('videos')
    .select('last_synced_at')
    .order('last_synced_at', { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({
    totalVideos: totalVideos || 0,
    lastSynced: lastSynced?.last_synced_at || null,
  });
}
