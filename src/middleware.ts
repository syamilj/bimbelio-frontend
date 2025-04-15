import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

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
    console.log(res);
    console.log("✅ Token check result:", data);
  } catch (error) {
    console.error("❌ Error in middleware fetch:", error);
  }

  console.log("✅ token : ", token);
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
