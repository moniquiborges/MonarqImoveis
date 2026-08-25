/**
 * MOCK — imagens de demonstração (Unsplash) usadas apenas até o cadastro
 * real de fotografias via painel administrativo / Supabase Storage.
 */
function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

export const mockImages = {
  coastalHouse1: unsplash("1613977257363-707ba9348227"),
  livingRoom1: unsplash("1600596542815-ffad4c1539a9"),
  livingRoom2: unsplash("1600585154340-be6161a56a0c"),
  houseExterior1: unsplash("1600607687939-ce8a6c25118c"),
  poolHouse: unsplash("1600585152220-90363fe7e115"),
  modernHouse: unsplash("1600566753086-00f18fb6b3ea"),
  bedroom1: unsplash("1600210492486-724fe5c67fb0"),
  kitchen1: unsplash("1613490493576-7fde63acd811"),
  beachAerial: unsplash("1518780664697-55e3ad937233"),
  beach2: unsplash("1507525428034-b723cf961d3e"),
  ruralLandscape1: unsplash("1500375592092-40eb2168fd21"),
  ruralLandscape2: unsplash("1500382017468-9049fed747ef"),
  farmField: unsplash("1500534623283-312aade485b7"),
  urbanBuilding1: unsplash("1592595896616-c37162298647"),
  urbanBuilding2: unsplash("1545324418-cc1a3fa10c00"),
  houseExterior2: unsplash("1494526585095-c41746248156"),
  houseExterior3: unsplash("1523217582562-09d0def993a6"),
  livingRoom3: unsplash("1600047509807-ba8f99d2cdde"),
};
