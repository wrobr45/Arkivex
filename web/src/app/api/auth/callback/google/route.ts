import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/landing?error=NoCodeProvided", request.url));
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    const redirectUri = `${new URL(request.url).origin}/api/auth/callback/google`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (tokens.access_token) {
      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const userData = await userRes.json();

      const response = NextResponse.redirect(new URL("/dashboard", request.url));
      response.cookies.set("arkivex_user", JSON.stringify({
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      }), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }
  } catch (e) {
    console.error("Google Auth Exchange Error", e);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
