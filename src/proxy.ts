import { NextRequest, NextResponse } from 'next/server';
import { env } from './env.mjs';

type DecodeData = {
  id: string;
  email: string;
  name: string;
  image: string;
  role: string;
  emailVerified: string;
  userTryOutId: string;
  createdAt: string;
  iat: number;
  exp: number;
};

export const proxy = async (req: NextRequest) => {
  try {
    const token = req.cookies.get('token')?.value;
    const pathname = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/verifyToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const resData: { status: number; message: string; data?: DecodeData } =
      await res.json();
    const { status, data } = resData;

    // console.log('[Session] : ', { resData, token });

    if (status !== 200) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (status === 200 && data) {
      if (
        pathname.includes('admin') &&
        data.role !== 'ADMIN' &&
        data.role !== 'SUPER_ADMIN' &&
        data.role !== 'FINANCE'
      ) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      if (pathname.includes('admin/category') && data.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/404', req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.next();
  }
};

export const config = {
  matcher: [
    // "/",
    '/:path*/auth/login',
    '/:path*/auth/signup',
    '/:path*/admin/:path*',
    '/:path*/user/:path*',
    '/:path*/user/explore/:path*',
    '/:path*/user/explore/:path*',
    '/:path*/user/bimarena/try-out/:path*',
    '/:path*/user/bimarena/try-out',
    '/:path*/user/workspace/:path*',
    '/:path*/verify/:path*',
    '/:path*/user/explore',
    '/:path*/user/explore/:path*',
    '/:path*/user/search',
    '/:path*/user/bimarena/leaderboard',
    '/:path*/user/bimboard',
    '/:path*/user/bimcourse/:path*',
    '/:path*/user/bimbot',
    '/:path*/user/bimbot/:path*',
    '/:path*/user/prediction',
    '/:path*/user/prediction/:path*',
    '/:path*/user/biminsight',
    '/:path*/user/biminsight/:path*',
    '/:path*/user/bimlive',
    '/:path*/user/bimlive/:path*',
  ],
};

/*
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;
  try {
    const res = await fetch(
      `https://p5pbbs3t-4000.asse.devtunnels.ms/auth/verifyToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
  } catch (error) {
    console.error("❌ Error in middleware fetch:", error);
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/signup",
    "/admin/:path*",
    "/user/explore/:path*",
    "/user/explore/:path*",
    "/user/bimarena/try-out/:path*",
    "/user/bimarena/try-out",
    "/user/workspace/:path*",
    "/verify/:path*",
    "/user/search",
    "/user/bimarena/leaderboard",
    "/user/bimboard",
    "/user/bimcourse/:path*",
    "/user/bimbot",
    "/user/bimbot/:path*",
  ],
};

*/
