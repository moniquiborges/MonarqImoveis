import type { MetadataRoute } from "next";
import { mockDevelopments } from "@/lib/mock/developments";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { mockRuralProperties } from "@/lib/mock/rural";
import { mockBlogPosts } from "@/lib/mock/posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://monarqimoveis.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Rotas Estáticas Principais
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/empreendimentos`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/empreendimentos/porto-belo`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/empreendimentos/itapema`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/empreendimentos/balneario-camboriu`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/imoveis/campo-grande`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/rural`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/sobre`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contato`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/venda-seu-imovel`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/conteudo`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Empreendimentos SC
  const developmentRoutes: MetadataRoute.Sitemap = mockDevelopments.map((dev) => ({
    url: `${siteUrl}/empreendimentos/${dev.city}/${dev.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Imóveis Urbanos
  const urbanRoutes: MetadataRoute.Sitemap = mockUrbanProperties.map((prop) => ({
    url: `${siteUrl}/imoveis/campo-grande/${prop.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Propriedades Rurais
  const ruralRoutes: MetadataRoute.Sitemap = mockRuralProperties.map((rural) => ({
    url: `${siteUrl}/rural/${rural.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Artigos do Blog
  const blogRoutes: MetadataRoute.Sitemap = mockBlogPosts.map((post) => ({
    url: `${siteUrl}/conteudo/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...developmentRoutes,
    ...urbanRoutes,
    ...ruralRoutes,
    ...blogRoutes,
  ];
}
