export const scCities = [
  { label: "Todos os Lançamentos", href: "/empreendimentos" },
  { label: "Porto Belo", href: "/empreendimentos/porto-belo" },
  { label: "Itapema", href: "/empreendimentos/itapema" },
  { label: "Balneário Camboriú", href: "/empreendimentos/balneario-camboriu" },
];

export const cgDefaultCategories = [
  { label: "Todos os Imóveis", href: "/imoveis/campo-grande" },
  { label: "Casas em Condomínio", href: "/imoveis/campo-grande?tipo=Casa+em+condom%C3%ADnio" },
  { label: "Terrenos & Lotes", href: "/imoveis/campo-grande?tipo=Terreno" },
];

export const primaryNav = [
  { label: "Empreendimentos SC", href: "/empreendimentos", children: scCities },
  { label: "Campo Grande", href: "/imoveis/campo-grande", children: cgDefaultCategories },
  { label: "Rural", href: "/rural" },
  { label: "Venda seu Imóvel", href: "/venda-seu-imovel" },
  { label: "Sobre", href: "/sobre" },
  { label: "Conteúdo", href: "/conteudo" },
  { label: "Contato", href: "/contato" },
];
