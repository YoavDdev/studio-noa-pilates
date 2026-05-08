-- Sample video data for Studio Noa Pilates with Vimeo integration
-- Run this in your Supabase SQL editor to populate the videos table
-- Replace the vimeo_id values with your actual Vimeo video IDs

INSERT INTO videos (
  title,
  description,
  duration,
  difficulty,
  focus_area,
  style,
  vimeo_id,
  thumbnail_url,
  is_premium,
  instructor_notes
) VALUES
(
  'פילאטיס לליבה חזקה',
  'שיעור מתמקד בחיזוק שרירי הליבה והשיפור היציבה. נתחיל בחימום עדין, נעבור לתרגילי ליבה מאתגרים ונסיים במתיחות מרגיעות.',
  1800,
  'beginner',
  'core',
  'mat',
  '123456789', -- Replace with your actual Vimeo video ID
  'https://i.vimeocdn.com/video/123456789_640x360.jpg',
  false,
  'זכרי לנשום עמוק ולהקשיב לגוף שלך. אל תכפי על עצמך - כל תנועה צריכה להיות מבוקרת ומדויקת.'
),
(
  'גמישות וזרימה עדינה',
  'שיעור עדין לשיפור הגמישות והתנועתיות. מתאים לכל הרמות, במיוחד לאחר יום ארוך או כשיעור בוקר מרגיע. נתמקד בפתיחת הירכיים, גב וכתפיים.',
  2700,
  'intermediate',
  true
),
(
  'פילאטיס מתקדם - אתגר מלא',
  'שיעור מאתגר לכל הגוף עם תרגילים מתקדמים. דורש ניסיון קודם בפילאטיס. נעבוד על כוח, שיווי משקל וקואורדינציה ברמה גבוהה.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '/img/video-thumbnails/advanced-challenge.jpg',
  3600,
  'strength',
  'classical',
  'advanced',
  true
),
(
  'איזון ויציבה לחיי יום',
  'שיעור לשיפור האיזון והיציבה, מתאים לכל הגילאים. נלמד כיצד לשפר את היציבה בישיבה ובעמידה, ונחזק את השרירים התומכים.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '/img/video-thumbnails/balance-posture.jpg',
  2400,
  'balance',
  'mat',
  'intermediate',
  false
),
(
  'פילאטיס לגיל הזהב',
  'שיעור מותאם במיוחד לגיל המבוגר. תרגילים עדינים ובטוחים לשיפור הכוח, הגמישות והאיזון. כל התרגילים ניתנים לביצוע בישיבה או עמידה.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '/img/video-thumbnails/seniors-pilates.jpg',
  2100,
  'flexibility',
  'seniors',
  'beginner',
  true
),
(
  'שיקום וחיזוק עדין',
  'שיעור לשיקום פציעות וחיזוק שרירים. מתאים למי שחוזר מפציעה או סובל מכאבי גב. תרגילים עדינים ומבוקרים עם דגש על טכניקה נכונה.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '/img/video-thumbnails/rehabilitation.jpg',
  2700,
  'rehabilitation',
  'mat',
  'beginner',
  true
),
(
  'בוקר טוב - התעוררות עדינה',
  'שיעור קצר ועדין להתחלת היום. תרגילי מתיחה ותנועה עדינה שיעירו את הגוף ויכינו אותו ליום. מתאים לכל הרמות.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '/img/video-thumbnails/morning-gentle.jpg',
  1500,
  'flexibility',
  'contemporary',
  'beginner',
  false
),
(
  'כוח פונקציונלי לחיי יום',
  'שיעור המתמקד בחיזוק שרירים לפעילויות יומיומיות. נלמד תנועות שימושיות כמו הרמה, נשיאה וכריעה בצורה בטוחה ויעילה.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '/img/video-thumbnails/functional-strength.jpg',
  3000,
  'strength',
  'mat',
  'intermediate',
  true
),
(
  'פילאטיס לנשים בהריון',
  'שיעור מותאם במיוחד לנשים בהריון. תרגילים בטוחים לחיזוק הליבה, שיפור היציבה והכנה ללידה. מתאים לכל שלושת השליש.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '/img/video-thumbnails/prenatal.jpg',
  2400,
  'core',
  'prenatal',
  'beginner',
  true
),
(
  'רגיעה ושחרור מתחים',
  'שיעור מרגיע לסיום היום. תרגילי נשימה, מתיחות עדינות ושחרור מתחים. מושלם אחרי יום מלחיץ או לפני השינה.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '/img/video-thumbnails/relaxation.jpg',
  2100,
  'flexibility',
  'contemporary',
  'beginner',
  false
);
