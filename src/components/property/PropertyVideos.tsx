import { Video } from "lucide-react";
import { parseExternalVideoUrl } from "@/lib/video";
import type { PropertyVideo } from "@/types";

export interface PropertyVideosProps {
  videos?: PropertyVideo[];
  title: string;
}

export function PropertyVideos({ videos, title }: PropertyVideosProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="my-8" aria-label={`Vídeos de ${title}`}>
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-graphite mb-3">
        <Video className="h-4 w-4 text-mineral" />
        Vídeos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video, i) => {
          const parsed = video.kind === "external" ? parseExternalVideoUrl(video.url) : null;

          return (
            <div
              key={`${video.url}-${i}`}
              className="relative aspect-video overflow-hidden rounded-xs bg-graphite border border-areia/50"
            >
              {parsed?.embedUrl ? (
                <iframe
                  src={parsed.embedUrl}
                  title={video.alt || `${title} - Vídeo ${i + 1}`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={video.url}
                  controls
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-contain bg-graphite"
                >
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-offwhite">
                    Assistir vídeo
                  </a>
                </video>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
