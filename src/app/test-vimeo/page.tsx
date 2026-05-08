// 🧪 דף בדיקה - Vimeo Integration
import { getAllVimeoVideos, getVimeoFolders } from '@/lib/vimeo';

export default async function TestVimeoPage() {
  const videos = await getAllVimeoVideos();
  const folders = await getVimeoFolders();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🧪 בדיקת חיבור Vimeo
        </h1>

        {/* Folders */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📁 תיקיות ({folders.length})
          </h2>
          {folders.length === 0 ? (
            <p className="text-gray-600">אין תיקיות או שהחיבור לא עובד</p>
          ) : (
            <ul className="space-y-2">
              {folders.map((folder) => (
                <li key={folder.uri} className="border-b pb-2">
                  <div className="font-semibold">{folder.name}</div>
                  <div className="text-sm text-gray-600">
                    {folder.metadata.connections.videos.total} סרטונים
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Videos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎥 סרטונים ({videos.length})
          </h2>
          {videos.length === 0 ? (
            <p className="text-gray-600">אין סרטונים או שהחיבור לא עובד</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.slice(0, 9).map((video) => (
                <div key={video.uri} className="border rounded-lg p-4">
                  {video.pictures?.sizes?.[0] && (
                    <img
                      src={video.pictures.sizes[0].link}
                      alt={video.name}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  )}
                  <h3 className="font-semibold text-sm mb-1">{video.name}</h3>
                  <p className="text-xs text-gray-600">
                    {Math.floor(video.duration / 60)} דקות
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="font-bold mb-2">🔍 מידע טכני:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(
              {
                hasToken: !!process.env.VIMEO_ACCESS_TOKEN,
                hasAppId: !!process.env.NEXT_PUBLIC_VIMEO_APP_ID,
                videosCount: videos.length,
                foldersCount: folders.length,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
