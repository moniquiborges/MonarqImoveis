import { MessageCircle } from "lucide-react";
import { buildWhatsappUrlFor } from "@/lib/site-config";
import type { ResolvedSiteConfig } from "@/lib/services/settingsService";

interface WhatsAppButtonProps {
  config: ResolvedSiteConfig;
}

export function WhatsAppButton({ config }: WhatsAppButtonProps) {
  const url = buildWhatsappUrlFor(
    config.whatsappNumber,
    "Olá, gostaria de falar com um especialista da MONARQ sobre oportunidades imobiliárias.",
  );

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      data-analytics-event="whatsapp_click"
      className="focus-ring fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-mineral text-offwhite shadow-[0_12px_32px_-8px_rgba(21,58,70,0.5)] transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
