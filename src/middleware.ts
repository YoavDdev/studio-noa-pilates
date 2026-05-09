// 🛡️ Middleware - הגנה על דפים ובדיקת הרשאות
// מבוסס על flyStick אבל מותאם ל-Supabase

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // דפים ציבוריים - כולם יכולים לגשת
  const publicPaths = ['/', '/login', '/register', '/packages'];
  if (publicPaths.includes(pathname)) {
    return response;
  }

  // דפי אדמין - רק למנהלים
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // בדיקה שהמשתמש הוא אדמין
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_id, user_type')
      .eq('id', user.id)
      .single();

    const isAdmin =
      profile?.subscription_id === 'Admin' || profile?.user_type === 'admin';

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
  }

  // דפים מוגנים - רק למשתמשים מחוברים
  const protectedPaths = ['/videos', '/profile', '/dashboard'];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // בדיקת גישה לתכנים פרימיום
  if (pathname.startsWith('/videos/') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_id, user_type, trial_start_date')
      .eq('id', user.id)
      .single();

    if (profile) {
      const hasAccess = checkPremiumAccess(
        profile.subscription_id,
        profile.user_type,
        profile.trial_start_date
      );

      // אם אין גישה, הפנה לדף מנויים
      if (!hasAccess) {
        // נאפשר צפייה בדף הסרטון אבל הנגן יהיה חסום
        // זה ייעשה ברמת הקומפוננט
      }
    }
  }

  return response;
}

/**
 * בדיקה האם למשתמש יש גישה לתכנים פרימיום
 */
function checkPremiumAccess(
  subscriptionId: string | null,
  userType: string | null,
  trialStartDate: string | null
): boolean {
  // אדמין - גישה מלאה
  if (subscriptionId === 'Admin' || userType === 'admin') {
    return true;
  }

  // מנוי פעיל
  if (subscriptionId && subscriptionId.startsWith('I-')) {
    return true;
  }

  // תקופת ניסיון - בדיקה שלא עברו 30 יום
  if (
    (subscriptionId === 'Trial' || userType === 'trial') &&
    trialStartDate
  ) {
    const trialStart = new Date(trialStartDate);
    const now = new Date();
    const daysPassed = Math.floor(
      (now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysPassed < 30;
  }

  return false;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
