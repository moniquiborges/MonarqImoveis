type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M14 9h2.5V6H14c-1.66 0-3 1.34-3 3v2H9v3h2v7h3v-7h2.2l.8-3H14V9.5c0-.28.22-.5.5-.5H14z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="7" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11 16.5V10M11 12.5c0-1.4 1-2.5 2.4-2.5S16 11.1 16 12.5v4" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M13.5 4v10.7a3.3 3.3 0 1 1-3.3-3.3" />
      <path d="M13.5 4c0 2.6 2.1 4.7 4.7 4.7" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function PinterestIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 17.5c.7-2.3 1.4-4.6 1.9-6.9M12 7.8c2 0 3.4 1.2 3.4 3.1 0 2-1.3 3.7-3.1 3.7-1 0-1.6-.5-1.9-1.1" />
    </svg>
  );
}

export function GenericSocialIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
    </svg>
  );
}

/**
 * Detecta o ícone de marca pelo nome digitado no painel (ex: "TikTok",
 * "youtube", "X (Twitter)"). Cai no ícone genérico se não reconhecer.
 */
export function resolveSocialIcon(label: string) {
  const key = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

  if (key.includes("tiktok")) return TikTokIcon;
  if (key.includes("youtube")) return YoutubeIcon;
  if (key.includes("linkedin")) return LinkedinIcon;
  if (key.includes("pinterest")) return PinterestIcon;
  if (key.includes("instagram")) return InstagramIcon;
  if (key.includes("facebook")) return FacebookIcon;
  if (key === "x" || key.includes("twitter")) return XIcon;
  return GenericSocialIcon;
}
