import {
  Building2,
  Contact,
  GalleryHorizontal,
  LandPlot,
  LayoutDashboard,
  Layers,
  Home,
  Newspaper,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

export const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Empreendimentos", href: "/admin/empreendimentos", icon: Building2 },
  { label: "Unidades", href: "/admin/unidades", icon: Layers },
  { label: "Imóveis", href: "/admin/imoveis", icon: Home },
  { label: "Rural", href: "/admin/rural", icon: LandPlot },
  { label: "Leads", href: "/admin/leads", icon: Contact },
  { label: "Corretores", href: "/admin/corretores", icon: Users },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Banners", href: "/admin/banners", icon: GalleryHorizontal },
  { label: "Usuários", href: "/admin/usuarios", icon: UserCog },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];
