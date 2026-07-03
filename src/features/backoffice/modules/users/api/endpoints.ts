const BASE = "/backoffice/users";

export const USERS_API = {
  registerUser: () => "/backoffice/auth/register",

  me: () => `${BASE}/me`,
  updateLocale: () => `${BASE}/locale`,
  updateTheme: () => `${BASE}/theme`,

  listUsers: () => BASE,
  user: (id: number) => `${BASE}/${id}`,
  updateUserStatus: (id: number) => `${BASE}/${id}/status`,
  changeUserLocation: (id: number) => `${BASE}/${id}/location`,
  changeUserSalarySettings: (id: number) => `${BASE}/${id}/salary-setting`,
  updateUserPermissions: (id: number) => `${BASE}/${id}/permissions`,
} as const;
