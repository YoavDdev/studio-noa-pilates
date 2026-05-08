// 🔐 Auth Helpers - מערכת הרשאות ובדיקת סוגי משתמשים
// מבוסס על flyStick אבל מותאם ל-Supabase

import { createClient } from '@/lib/supabase/server';

export type UserType = 'admin' | 'premium' | 'trial' | 'free' | 'none';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_id: string | null;
  user_type: string;
  trial_start_date: string | null;
  subscription_start_date: string | null;
  cancellation_date: string | null;
  paypal_status: string | null;
  paypal_id: string | null;
  has_seen_welcome_message: boolean;
  created_at: string;
}

/**
 * קבלת סוג המשתמש על בסיס subscription_id
 */
export function getUserType(subscriptionId: string | null, userType?: string): UserType {
  // אדמין - גישה מלאה
  if (subscriptionId === 'Admin' || userType === 'admin') {
    return 'admin';
  }
  
  // מנוי פעיל - PayPal subscription ID מתחיל ב-I-
  if (subscriptionId && subscriptionId.startsWith('I-')) {
    return 'premium';
  }
  
  // תקופת ניסיון
  if (subscriptionId === 'Trial' || userType === 'trial') {
    return 'trial';
  }
  
  // משתמש חינמי רשום
  if (subscriptionId === 'Free' || userType === 'free') {
    return 'free';
  }
  
  // לא רשום
  return 'none';
}

/**
 * בדיקה האם המשתמש הוא אדמין
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_id, user_type')
    .eq('id', user.id)
    .single();
  
  if (!profile) return false;
  
  return getUserType(profile.subscription_id, profile.user_type) === 'admin';
}

/**
 * בדיקה האם למשתמש יש גישה לתכנים פרימיום
 */
export async function hasAccessToPremiumContent(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_id, user_type, trial_start_date, paypal_status')
    .eq('id', user.id)
    .single();
  
  if (!profile) return false;
  
  const userType = getUserType(profile.subscription_id, profile.user_type);
  
  // אדמין ומנויים פרימיום - גישה מלאה
  if (userType === 'admin' || userType === 'premium') {
    return true;
  }
  
  // תקופת ניסיון - בדיקה שלא עברו 30 יום
  if (userType === 'trial' && profile.trial_start_date) {
    const trialStart = new Date(profile.trial_start_date);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysPassed < 30;
  }
  
  return false;
}

/**
 * קבלת פרופיל המשתמש המלא
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error || !profile) return null;
  
  return profile as UserProfile;
}

/**
 * בדיקה האם תקופת הניסיון פגה
 */
export function isTrialExpired(trialStartDate: string | null): boolean {
  if (!trialStartDate) return false;
  
  const trialStart = new Date(trialStartDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysPassed >= 30;
}

/**
 * קבלת מספר הימים שנותרו בתקופת הניסיון
 */
export function getTrialDaysRemaining(trialStartDate: string | null): number {
  if (!trialStartDate) return 0;
  
  const trialStart = new Date(trialStartDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, 30 - daysPassed);
}

/**
 * קבלת טקסט סטטוס המנוי בעברית
 */
export function getSubscriptionStatusText(userType: UserType, trialStartDate?: string | null): string {
  switch (userType) {
    case 'admin':
      return 'מנהל מערכת';
    case 'premium':
      return 'מנוי פעיל';
    case 'trial':
      if (trialStartDate) {
        const daysLeft = getTrialDaysRemaining(trialStartDate);
        return `תקופת ניסיון - ${daysLeft} ימים נותרו`;
      }
      return 'תקופת ניסיון';
    case 'free':
      return 'משתמש חינמי';
    case 'none':
      return 'לא רשום';
  }
}

/**
 * בדיקה האם המשתמש יכול לגשת לדף מסוים
 */
export async function canAccessPage(requiredType: UserType[]): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  if (!profile) return false;
  
  const userType = getUserType(profile.subscription_id, profile.user_type);
  return requiredType.includes(userType);
}
