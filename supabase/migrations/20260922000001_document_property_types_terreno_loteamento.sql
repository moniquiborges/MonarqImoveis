-- MONARQ — Documentação e Padronização de Categorias/Tipos de Imóveis (Terreno e Loteamento)
--
-- Motivo: Formalização e suporte integral das categorias "Terreno" e "Loteamento"
-- tanto em Mato Grosso do Sul quanto em Santa Catarina.
--
-- 1. Garante a coluna na tabela `developments` (Santa Catarina)
ALTER TABLE public.developments ADD COLUMN IF NOT EXISTS property_type text;
COMMENT ON COLUMN public.developments.property_type IS 'Tipo/Categoria do empreendimento em SC (ex: Apartamento, Cobertura, Terreno, Loteamento, Casa em condomínio)';

-- 2. Documentação na tabela `urban_properties` (Mato Grosso do Sul)
COMMENT ON COLUMN public.urban_properties.property_type IS 'Tipo/Categoria do imóvel em MS (ex: Apartamento, Cobertura, Casa em condomínio, Casa, Sobrado, Terreno, Loteamento, Comercial)';
