import { z } from "zod";

export const githubOauthClientId = z.string().parse(import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID);
