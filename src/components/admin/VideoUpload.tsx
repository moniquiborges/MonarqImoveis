"use client";

import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, Video, Trash2, Film } from "lucide-react";
import { parseExternalVideoUrl } from "@/lib/video";

export interface VideoData {
  url: string;
  kind: "upload" | "external";
  alt?: string;
}

interface VideoUploadProps {
  label?: string;
  helperText?: string;
  videos: VideoData[];
  onChange: (videos: VideoData[]) => void;
  className?: string;
}

export function VideoUpload({
  label = "Vídeos do Anúncio",
  helperText,
  videos,
  onChange,
  className = "",
}: VideoUploadProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addVideos = (newItems: VideoData[]) => {
    if (!newItems || newItems.length === 0) return;
    const incomingValid = newItems.filter(
      (n) => n.url && !videos.some((existing) => existing.url === n.url)
    );
    if (incomingValid.length === 0) return;
    onChange([...videos, ...incomingValid]);
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    setUploadError(null);
    const uploaded: VideoData[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("video/")) continue;

      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/media/upload-video", { method: "POST", body });
        const result = await res.json();

        if (result.success && result.url) {
          uploaded.push({
            url: result.url,
            kind: "upload",
            alt: file.name.replace(/\.[^/.]+$/, ""),
          });
        } else {
          setUploadError(result.error || "Falha ao enviar o vídeo.");
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Falha ao enviar o vídeo.");
      }
    }

    addVideos(uploaded);
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    addVideos([{ url: urlInput.trim(), kind: "external", alt: "Vídeo" }]);
    setUrlInput("");
  };

  const handleRemove = (videoToRemove: VideoData) => {
    onChange(videos.filter((v) => v.url !== videoToRemove.url));
  };

  return (
    <div className={`space-y-4 rounded-sm border border-areia/70 bg-white p-4 shadow-xs ${className}`}>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-areia/40 pb-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-graphite flex items-center gap-1.5">
            <Video className="h-4 w-4 text-mineral" />
            {label}
          </h4>
          <p className="text-[11px] text-graphite/60 mt-0.5">
            {helperText ||
              "Envie o arquivo de vídeo diretamente ou cole um link (YouTube, Vimeo ou link direto)."}
          </p>
        </div>

        {videos.length > 0 && (
          <div className="flex items-center gap-1.5 bg-mineral/10 text-mineral px-2.5 py-1 rounded-xs text-[11px] font-semibold">
            <Film className="h-3.5 w-3.5" />
            <span>
              {videos.length} {videos.length === 1 ? "vídeo" : "vídeos"} adicionados
            </span>
          </div>
        )}
      </div>

      {/* Abas de Envio */}
      <div className="flex items-center gap-2 border-b border-areia/30 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
            activeTab === "upload"
              ? "bg-mineral text-offwhite font-semibold shadow-xs"
              : "text-graphite/60 hover:text-graphite hover:bg-offwhite"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload de Vídeo
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
            activeTab === "url"
              ? "bg-mineral text-offwhite font-semibold shadow-xs"
              : "text-graphite/60 hover:text-graphite hover:bg-offwhite"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          Link (YouTube / Vimeo / URL)
        </button>
      </div>

      {/* Conteúdo da Aba: Upload */}
      {activeTab === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xs p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-mineral bg-mineral/5 scale-[0.99]"
              : "border-areia/80 bg-offwhite/40 hover:border-mineral/60 hover:bg-offwhite"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
            }}
          />
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white border border-areia/60 shadow-xs mb-2.5 text-mineral">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-graphite">
            {isUploading
              ? "Enviando vídeo..."
              : "Clique para selecionar vídeos ou arraste e solte aqui"}
          </p>
          <p className="text-[11px] text-graphite/60 mt-1">
            Formatos suportados: MP4, MOV, WEBM (até 200MB por arquivo)
          </p>
          {uploadError && (
            <p className="text-[11px] text-rose-600 mt-2 font-medium">{uploadError}</p>
          )}
        </div>
      )}

      {/* Conteúdo da Aba: Link / URL */}
      {activeTab === "url" && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlSubmit();
              }
            }}
            className="focus-ring flex-1 rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite placeholder:text-graphite/40"
          />
          <button
            type="button"
            onClick={() => handleUrlSubmit()}
            className="rounded-xs bg-mineral px-4 py-2 text-xs font-semibold text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shrink-0"
          >
            + Adicionar Vídeo
          </button>
        </div>
      )}

      {/* Grid de vídeos adicionados */}
      {videos.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-areia/30">
          <span className="text-[11px] font-semibold text-graphite uppercase tracking-wider block">
            Vídeos do Anúncio ({videos.length}):
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {videos.map((v, i) => {
              const parsed = v.kind === "external" ? parseExternalVideoUrl(v.url) : null;

              return (
                <div
                  key={`${v.url}-${i}`}
                  className="group relative aspect-[16/10] overflow-hidden rounded-xs bg-graphite border border-areia/70 hover:border-mineral/50 transition-all"
                >
                  {v.kind === "upload" ? (
                    <video src={v.url} preload="metadata" className="h-full w-full object-cover" muted />
                  ) : parsed?.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={parsed.thumbnailUrl}
                      alt={v.alt || `Vídeo ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-1.5 text-offwhite/70 p-2 text-center">
                      <Film className="h-6 w-6" />
                      <span className="text-[10px] break-all line-clamp-2">{v.url}</span>
                    </div>
                  )}

                  <div className="absolute top-1.5 left-1.5 rounded-xs bg-graphite/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-offwhite shadow-md">
                    {v.kind === "upload" ? "Upload" : parsed?.platform === "youtube" ? "YouTube" : parsed?.platform === "vimeo" ? "Vimeo" : "Link"}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(v)}
                    title="Excluir vídeo"
                    className="absolute top-1.5 right-1.5 rounded-xs bg-graphite/80 p-1.5 text-offwhite opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all shadow-xs cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
