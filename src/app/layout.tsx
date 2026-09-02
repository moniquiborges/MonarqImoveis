import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://monarqimoveis.com.br";

export const viewport: Viewport = {
  themeColor: "#153a46",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MONARQ Imóveis & Investimentos | Litoral SC, Campo Grande e Rural",
    template: "%s | MONARQ Imóveis & Investimentos",
  },
  description:
    "Curadoria imobiliária de alto padrão no litoral catarinense (Porto Belo, Itapema, Balneário Camboriú), imóveis urbanos em Campo Grande e fazendas no Centro-Oeste.",
  keywords: [
    "imobiliária alto padrão",
    "imóveis Porto Belo",
    "apartamentos Itapema",
    "lançamentos Balneário Camboriú",
    "imóveis Campo Grande MS",
    "fazendas à venda MS",
    "fazendas Mato Grosso",
    "investimento imobiliário",
    "MONARQ imóveis",
  ],
  authors: [{ name: "MONARQ Imóveis & Investimentos" }],
  creator: "MONARQ Imóveis",
  publisher: "MONARQ Imóveis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "MONARQ Imóveis & Investimentos",
    title: "MONARQ Imóveis & Investimentos | Curadoria Imobiliária de Alto Padrão",
    description:
      "Construímos. Avaliamos. Vendemos. Regularizamos. Empreendimentos no litoral de SC, mercado urbano e agronegócio.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "MONARQ Imóveis & Investimentos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MONARQ Imóveis & Investimentos",
    description:
      "Curadoria imobiliária de alto padrão em Santa Catarina, Campo Grande e agronegócio.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
