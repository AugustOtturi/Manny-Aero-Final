export type PinColor = "gold" | "red" | "blue" | "orange";

export interface MapPin {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
  color: PinColor;
}

/**
 * Position percentages are relative to the map container (not a real projection).
 * They will be re-calibrated once the real Mexico SVG is dropped in.
 */
export const PINS: MapPin[] = [
  { id: "gdl", label: "Guadalajara", xPct: 38, yPct: 48, color: "orange" },
  { id: "mty", label: "Monterrey", xPct: 48, yPct: 32, color: "gold" },
  { id: "aifa", label: "Felipe Ángeles (AIFA)", xPct: 52, yPct: 52, color: "blue" },
  { id: "puebla", label: "Puebla / CDMX", xPct: 55, yPct: 58, color: "gold" },
  { id: "oax", label: "Oaxaca", xPct: 60, yPct: 68, color: "gold" },
  { id: "can", label: "Cancún", xPct: 82, yPct: 52, color: "red" },
];

export const LEGEND: { color: PinColor; label: string }[] = [
  { color: "orange", label: "Manny Agent" },
  { color: "red", label: "Manny Agent" },
  { color: "blue", label: "Manny Agent" },
  { color: "gold", label: "Manny Agent" },
];

export const STATS = [
  { value: "+12", label: "Trip support providers choose Manny." },
  { value: "+300", label: "Trust Manny for every flight." },
  { value: "+10,000", label: "Operations handled in Mexico." },
];
