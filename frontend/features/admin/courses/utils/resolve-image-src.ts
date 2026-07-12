export function resolveImageSrc(src: string | null | undefined): string | null {
  if (!src) return null;

  if (src.startsWith("blob:")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  return `${backendUrl}/storage/${src.replace(/^\/+/, "")}`;
}
