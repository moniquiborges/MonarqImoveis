export type ExternalVideoPlatform = "youtube" | "vimeo" | "direct";

export interface ParsedExternalVideo {
  platform: ExternalVideoPlatform;
  embedUrl?: string;
  thumbnailUrl?: string;
}

const YOUTUBE_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/;
const VIMEO_RE = /vimeo\.com\/(?:video\/)?(\d+)/;

/** Identifica a plataforma de um link de vídeo externo e monta URL de embed/thumbnail. */
export function parseExternalVideoUrl(url: string): ParsedExternalVideo {
  const youtubeMatch = url.match(YOUTUBE_RE);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const vimeoMatch = url.match(VIMEO_RE);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    return {
      platform: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${id}`,
    };
  }

  return { platform: "direct" };
}
