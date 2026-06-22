const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const authApi = {
  getGoogleOAuthUrl: () => `${apiBaseUrl}/auth/google`,
  getGithubOAuthUrl: () => `${apiBaseUrl}/auth/github`,
};
