import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;

  const isAdmin    = path.startsWith('/admin');
  const isLoginAdm = path === '/admin/login';
  const isAccount  = path.startsWith('/account');
  const isCheckout = path.startsWith('/checkout');
  const isLogin    = path === '/login' || path === '/signup';

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isAdmin && !isLoginAdm) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if ((isAccount || isCheckout) && !isLogin) {
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url));
    }
    return NextResponse.next({ request });
  }

  let res = NextResponse.next({ request });
  const sb = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        res = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await sb.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdminUser = user?.email && user.email === adminEmail;

  // Admin gate
  if (isAdmin && !isLoginAdm && (!user || !isAdminUser)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  if (isLoginAdm && user && isAdminUser) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Customer gate (account + checkout)
  if ((isAccount || isCheckout) && !user) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(path)}`, request.url));
  }

  // Already logged in users shouldn't see /login or /signup
  if (isLogin && user) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*', '/login', '/signup'],
};
