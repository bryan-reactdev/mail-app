import { API_BASE_IP } from "./axiosWrapper";

// Generic fallback image
const PLACEHOLDER = "https://via.placeholder.com/400x300?text=No+Image";

export function resolveImage(
  path: string | null | undefined
): string {
  if (!path) return PLACEHOLDER;
  if (path.startsWith("http")) return path;
  // Always ensure single slash regardless of starting slash
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_IP}/${normalized}`;
}

