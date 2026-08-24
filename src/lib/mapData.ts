import type { AirportRow, MapCategoryRow } from "./server/db/schema";

export interface MapCategoryDTO {
  id: number;
  name: string;
  short: string;
  color: string;
  sortOrder: number;
}

export interface MapAirportDTO {
  id: number;
  name: string;
  lat: number;
  lng: number;
  categoryId: number;
  info: string;
  pdfUrl: string | null;
  pdfName: string | null;
}

export interface MapData {
  categories: MapCategoryDTO[];
  airports: MapAirportDTO[];
}

export function toMapData(categories: MapCategoryRow[], airports: AirportRow[]): MapData {
  return {
    categories: [...categories]
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
      .map((c) => ({ id: c.id, name: c.name, short: c.short, color: c.color, sortOrder: c.sortOrder })),
    airports: airports.map((a) => ({
      id: a.id,
      name: a.name,
      lat: a.lat,
      lng: a.lng,
      categoryId: a.categoryId,
      info: a.info ?? "",
      pdfUrl: a.pdfUrl ?? null,
      pdfName: a.pdfName ?? null,
    })),
  };
}

// Escapes "<" so the JSON can't close the <script type="application/json">
// tag it's embedded in (e.g. an airport named "</script><script>...").
export function serializeMapData(data: MapData): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
