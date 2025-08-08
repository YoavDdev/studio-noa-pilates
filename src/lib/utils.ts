import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function isSubscriptionActive(expiresAt: string | null): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) > new Date()
}

export function canAccessVideo(
  isVideoFree: boolean,
  subscriptionType: string | null,
  lessonsRemaining: number | null,
  subscriptionExpiresAt: string | null
): boolean {
  // Free videos are always accessible
  if (!isVideoFree) return true
  
  // Premium subscription with active subscription
  if (subscriptionType === 'premium' && isSubscriptionActive(subscriptionExpiresAt)) {
    return true
  }
  
  // Package subscription with remaining lessons
  if (subscriptionType === 'package' && lessonsRemaining && lessonsRemaining > 0) {
    return true
  }
  
  return false
}
