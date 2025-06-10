import { z } from "zod";

export const apiUrl = z
    .string()
    .url()
    .parse(import.meta.env.VITE_API_URL);

export const githubOauthClientId = z.string().parse(import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID);
