export const getAvatarSrc = (url: string): string => {
  if (!import.meta.env.DEV) return url;
  try {
    const apiOrigin = new URL(import.meta.env.VITE_API_URL).origin;
    if (url.startsWith(apiOrigin)) {
      return url.slice(apiOrigin.length);
    }
  } catch {
    // ignore
  }
  return url;
};
