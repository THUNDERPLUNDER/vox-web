/* CONTRACT: Small environment boundary shared by Preview access and global robots handling. */

export function isVercelPreview(environment = process.env.VERCEL_ENV): boolean {
  return environment === "preview";
}
