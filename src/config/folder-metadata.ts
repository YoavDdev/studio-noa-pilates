// Folder Metadata Configuration
// כל תיקייה מ-Vimeo עם המטא-דאטה שלה

export interface FolderMetadata {
  description: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  levelHebrew: string
  category: string
  order: number
  isVisible: boolean
  colorTheme?: string
}

export const folderMetadata: Record<string, FolderMetadata> = {
  // ===== 4 תיקיות ראשיות בלבד =====
  
  "נשימה": {
    description: "תרגילי נשימה לשחרור ורגיעה",
    level: "all",
    levelHebrew: "כל הרמות",
    category: "breathing",
    order: 1,
    isVisible: true,
    colorTheme: "#E6F7FF"
  },
  
  "עשו את זה בבית !": {
    description: "תרגילים קלים לביצוע בבית - עם תת-תיקיות",
    level: "beginner",
    levelHebrew: "מתחילות",
    category: "home",
    order: 2,
    isVisible: true,
    colorTheme: "#FFE6D6"
  },
  
  "פיטנס": {
    description: "שיעורי פיטנס אנרגטיים",
    level: "intermediate",
    levelHebrew: "בינוני",
    category: "fitness",
    order: 3,
    isVisible: true,
    colorTheme: "#FFEBF0"
  },
  
  "פלייסטיק שעורים קצרים": {
    description: "שיעורים קצרים עם מקל פלייסטיק",
    level: "all",
    levelHebrew: "כל הרמות",
    category: "quick",
    order: 4,
    isVisible: true,
    colorTheme: "#F0FFE6"
  },
  
  // ===== תיקיות משניות (לא מוצגות בעמוד הראשי) =====
  
  "סדנאות": {
    description: "סדנאות מיוחדות ותכנים לימודיים",
    level: "all",
    levelHebrew: "כל הרמות",
    category: "education",
    order: 999,
    isVisible: false,
    colorTheme: "#FFF7E6"
  },
  
  "פלייסטיק": {
    description: "תרגילים עם מקל פלייסטיק",
    level: "intermediate",
    levelHebrew: "בינוני",
    category: "equipment",
    order: 999,
    isVisible: false,
    colorTheme: "#F0E6FF"
  },
  
  "פלייסטיק בבית": {
    description: "תרגילי פלייסטיק לביצוע בבית",
    level: "beginner",
    levelHebrew: "מתחילות",
    category: "equipment",
    order: 999,
    isVisible: false,
    colorTheme: "#E6F0FF"
  },
  
  "קובייה": {
    description: "תרגילים עם קוביה",
    level: "beginner",
    levelHebrew: "מתחילות",
    category: "equipment",
    order: 999,
    isVisible: false,
    colorTheme: "#FFE6F7"
  },
  
  "קיר ומתיחת זרועות": {
    description: "תרגילי קיר למתיחת זרועות",
    level: "all",
    levelHebrew: "כל הרמות",
    category: "stretching",
    order: 999,
    isVisible: false,
    colorTheme: "#E6FFF7"
  },
  
  "שחרור גב על הספה": {
    description: "תרגילים לשחרור גב בעזרת הספה",
    level: "beginner",
    levelHebrew: "מתחילות",
    category: "therapy",
    order: 999,
    isVisible: false,
    colorTheme: "#FFF7F0"
  },
  
  "שיעור מלא מתוך הסטודיו": {
    description: "שיעורים מלאים מהסטודיו",
    level: "intermediate",
    levelHebrew: "בינוני",
    category: "full_class",
    order: 999,
    isVisible: false,
    colorTheme: "#F7E6FF"
  },
  
  "תרגול כפות רגליים": {
    description: "תרגילים לחיזוק כפות הרגליים",
    level: "all",
    levelHebrew: "כל הרמות",
    category: "therapy",
    order: 999,
    isVisible: false,
    colorTheme: "#E6F7E6"
  },
  
  "תרגול עם גליל": {
    description: "תרגילים עם גליל פילאטיס",
    level: "all",
    levelHebrew: "כל הרמות",
    category: "equipment",
    order: 999,
    isVisible: false,
    colorTheme: "#FFE6E6"
  },
  
  "תרגול רצפה בבית": {
    description: "תרגילי רצפה לביצוע בבית",
    level: "beginner",
    levelHebrew: "מתחילות",
    category: "home",
    order: 999,
    isVisible: false,
    colorTheme: "#F0F7FF"
  },
  
  // תיקיות שלא מוצגות (תת-תיקיות או מוסתרות)
  "My library": {
    description: "ספריה ראשית",
    level: "all",
    levelHebrew: "כל הרמות",
    category: "root",
    order: 999,
    isVisible: false
  },
  
  "גומיה והתנגדויות": {
    description: "תרגילים עם גומיה והתנגדויות",
    level: "intermediate",
    levelHebrew: "בינוני",
    category: "equipment",
    order: 999,
    isVisible: false // תת-תיקייה תחת "שיעור מלא"
  },
  
  "חיזוק זרועות וקיר": {
    description: "חיזוק זרועות בעזרת הקיר",
    level: "intermediate",
    levelHebrew: "בינוני",
    category: "stretching",
    order: 999,
    isVisible: false // תת-תיקייה תחת "עשו את זה בבית"
  },
  
  "חישוק": {
    description: "תרגילים עם חישוק",
    level: "beginner",
    levelHebrew: "מתחילות",
    category: "equipment",
    order: 999,
    isVisible: false // תת-תיקייה תחת "שיעור מלא"
  },
  
  "משקולות": {
    description: "תרגילים עם משקולות",
    level: "intermediate",
    levelHebrew: "בינוני",
    category: "equipment",
    order: 999,
    isVisible: false // תת-תיקייה תחת "שיעור מלא"
  }
}

// Helper function to get metadata for a folder (with fallback)
export const getFolderMetadata = (folderName: string): FolderMetadata => {
  if (folderMetadata[folderName]) {
    return folderMetadata[folderName]
  }
  
  // Fallback for new folders
  return {
    description: 'תכנים חדשים',
    level: 'all',
    levelHebrew: 'כל הרמות',
    category: 'new',
    order: 999,
    isVisible: true,
    colorTheme: '#FFE6D6'
  }
}

// Get only visible folders
export const getVisibleFolders = (): Record<string, FolderMetadata> => {
  return Object.fromEntries(
    Object.entries(folderMetadata).filter(([, metadata]) => metadata.isVisible)
  )
}
