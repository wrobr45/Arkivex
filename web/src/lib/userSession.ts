export function getCurrentUserEmail(): string {
  if (typeof document === "undefined") return "guest@arkivex.io";
  
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const cookieData = getCookie("arkivex_user");
  if (cookieData) {
    try {
      const parsed = JSON.parse(decodeURIComponent(cookieData));
      if (parsed.email) return parsed.email;
    } catch (e) {
      console.error("Failed to parse user session cookie", e);
    }
  }
  return "guest@arkivex.io";
}
