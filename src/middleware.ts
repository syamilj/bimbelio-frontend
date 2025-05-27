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

export const middleware = async (req: NextRequest) => {
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

    if (status !== 200) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (status === 200 && data) {
      if (pathname.includes('admin') && data.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
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
    '/:path*/user/explore/:path*',
    '/:path*/user/explore/:path*',
    '/:path*/user/try-out/:path*',
    '/:path*/user/try-out',
    '/:path*/user/workspace/:path*',
    '/:path*/verify/:path*',
    '/:path*/user/search',
    '/:path*/user/leaderboard',
    '/:path*/user/dashboard',
    '/:path*/user/course/:path*',
    '/:path*/user/chat',
    '/:path*/user/chat/:path*',
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
    "/user/try-out/:path*",
    "/user/try-out",
    "/user/workspace/:path*",
    "/verify/:path*",
    "/user/search",
    "/user/leaderboard",
    "/user/dashboard",
    "/user/course/:path*",
    "/user/chat",
    "/user/chat/:path*",
  ],
};

*/
