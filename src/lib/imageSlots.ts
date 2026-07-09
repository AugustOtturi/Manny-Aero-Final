// Canonical list of index-page images the client can replace from /admin/images.
// category+slug pairs must match the calls to <ReplaceableImage> in components.
export interface ImageSlot {
  category: string;
  slug: string;
  label: string;
  hint: string;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  { category: "subhero", slug: "feature", label: "SubHero — Imagen principal (25+ años)", hint: "Recomendado: 1600×1200px o mayor, horizontal" },
  { category: "subhero", slug: "photo-1", label: "SubHero — Foto 1 (agentes en pista)", hint: "Recomendado: 800×1000px, vertical" },
  { category: "subhero", slug: "photo-2", label: "SubHero — Foto 2 (técnico en tren de aterrizaje)", hint: "Recomendado: 800×1000px, vertical" },
  { category: "subhero", slug: "photo-3", label: "SubHero — Foto 3 (despachador de operaciones)", hint: "Recomendado: 800×1000px, vertical" },
  { category: "service", slug: "ground-handling", label: "Servicio — Ground Handling", hint: "Recomendado: 800×1200px, vertical" },
  { category: "service", slug: "permits", label: "Servicio — Permits & Authorizations", hint: "Recomendado: 800×1200px, vertical" },
  { category: "service", slug: "catering", label: "Servicio — Manny's In-Flight Catering", hint: "Recomendado: 800×1200px, vertical" },
  { category: "service", slug: "audits", label: "Servicio — IS-BAH Audits", hint: "Recomendado: 800×1200px, vertical" },
];

// Logos de partners/eventos NO son slots fijos — son una lista dinámica
// (CRUD completo) gestionada en /admin/images/logos y renderizada por
// FinalCTA.astro directamente desde la tabla `images` (category="logo").
