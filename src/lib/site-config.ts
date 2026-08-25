export const siteConfig = {
  name: "MONARQ Imóveis & Investimentos",
  tagline: "Construímos. Avaliamos. Vendemos. Regularizamos.",
  address: process.env.NEXT_PUBLIC_ADDRESS || null,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
  whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || null,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || null,
  creci: process.env.NEXT_PUBLIC_CRECI || null,
  cnpj: process.env.NEXT_PUBLIC_CNPJ || null,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || null,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || null,
};

export function buildWhatsappUrl(message: string) {
  if (!siteConfig.whatsappNumber) return null;
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${siteConfig.whatsappNumber}?${params.toString()}`;
}
