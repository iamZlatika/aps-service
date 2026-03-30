export const isCustomAvatar = (avatarUrl: string): boolean => {
  return !avatarUrl.endsWith("/default.png");
};
