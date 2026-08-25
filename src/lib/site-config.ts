export const siteConfig = {
  name: "MONARQ Imóveis & Investimentos",
  tagline: "Construímos. Avaliamos. Vendemos. Regularizamos.",
  secondaryTagline: "Apoio jurídico especializado.",
  manifesto: "INTELIGÊNCIA DE MERCADO. PATRIMÔNIO QUE PERMANECE.",
  address:
    process.env.NEXT_PUBLIC_ADDRESS ||
    "Av. Afonso Pena, 1.897 – 4° Andar – Edifício Executive Center, Campo Grande - MS",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5567982133789",
  whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "(67) 98213-3789",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contatomonarqimoveis@gmail.com",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "(47) 99976-1982",
  phoneScDisplay: "(47) 99976-1982",
  phoneMsDisplay: "(67) 98213-3789",
  creci: process.env.NEXT_PUBLIC_CRECI || "12.345-J",
  cnpj: process.env.NEXT_PUBLIC_CNPJ || "00.000.000/0001-00",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/monarqimoveis.invest?igsh=ZmFnajlia2h2NDRx&igsi=ZmFnajlia2h2NDRx",
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "@monarqimoveis.invest",
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://www.facebook.com/profile.php?id=61593460760067",
};

export function buildWhatsappUrl(message: string) {
  if (!siteConfig.whatsappNumber) return null;
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${siteConfig.whatsappNumber}?${params.toString()}`;
}
