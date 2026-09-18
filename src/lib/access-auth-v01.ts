/* CONTRACT: Stateless Better Auth Google identity for Viddel admin/partner access. Not end-user auth. #457 */
import { betterAuth } from "better-auth";
import { oAuthProxy } from "better-auth/plugins";
import { canAccessRole, resolveAccessRole, type AccessRole } from "./access-roles-v01.ts";

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env?.[name] ?? "").trim();
}

const authSecret = readEnv("BETTER_AUTH_SECRET");
const googleClientId = readEnv("GOOGLE_CLIENT_ID");
const googleClientSecret = readEnv("GOOGLE_CLIENT_SECRET");
const oauthProxySecret = readEnv("VIDDEL_OAUTH_PROXY_SECRET");

export function isAccessAuthConfigured(): boolean {
  return Boolean(
    authSecret &&
    googleClientId &&
    googleClientSecret &&
    oauthProxySecret &&
    (readEnv("VIDDEL_ADMIN_EMAILS") || readEnv("VIDDEL_PARTNER_EMAILS")),
  );
}

export const accessAuth = betterAuth({
  appName: "Viddel",
  secret: authSecret || "viddel-access-unconfigured-build-only-secret-do-not-use",
  baseURL: {
    allowedHosts: [
      "www.viddel.no",
      "viddel.no",
      "*.vercel.app",
      "localhost:4321",
      "localhost:3000",
    ],
    fallback: "https://www.viddel.no",
  },
  trustedOrigins: [
    "https://www.viddel.no",
    "https://viddel.no",
    "https://*.vercel.app",
    "http://localhost:4321",
    "http://localhost:3000",
  ],
  user: {
    validateUserInfo: ({ user, source }) => {
      if (source.oauth?.providerId !== "google") {
        return {
          error: "provider_not_allowed",
          errorDescription: "Use Google to sign in.",
        };
      }

      if (!resolveAccessRole(user.email)) {
        return {
          error: "email_not_allowed",
          errorDescription: "Denne Google-kontoen har ikke tilgang til Viddel.",
        };
      }
    },
  },
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
  plugins: oauthProxySecret
    ? [
        oAuthProxy({
          productionURL: "https://www.viddel.no",
          secret: oauthProxySecret,
          maxAge: 60,
        }),
      ]
    : [],
});

export type ViddelAccessSession = {
  email: string;
  name: string;
  role: AccessRole;
};

export async function getViddelAccessSession(request: Request): Promise<ViddelAccessSession | null> {
  if (!isAccessAuthConfigured()) return null;

  const result = await accessAuth.api.getSession({
    headers: request.headers,
  });

  const email = result?.user?.email?.trim().toLowerCase() ?? "";
  const role = resolveAccessRole(email);
  if (!email || !role) return null;

  return {
    email,
    name: result?.user?.name?.trim() || email,
    role,
  };
}

export async function requireViddelRole(
  request: Request,
  required: AccessRole,
): Promise<
  | { ok: true; session: ViddelAccessSession }
  | { ok: false; status: 401 | 403; reason: "unauthenticated" | "forbidden" }
> {
  const session = await getViddelAccessSession(request);
  if (!session) return { ok: false, status: 401, reason: "unauthenticated" };
  if (!canAccessRole(session.role, required)) {
    return { ok: false, status: 403, reason: "forbidden" };
  }
  return { ok: true, session };
}
