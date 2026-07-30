export const triggerGoogleOAuth = () => {
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "247412511264-kl0522e0itc0j7odlvkqqvd7gobjubpl.apps.googleusercontent.com";

  const redirectUri = encodeURIComponent("http://localhost:3000/api/auth/callback/google");
  const scope = encodeURIComponent("openid email profile");
  const responseType = "code";

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=consent`;

  window.location.href = googleAuthUrl;
};
