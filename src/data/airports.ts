export interface Airport {
  id: number;
  nombre: string;
  lat: number;
  lng: number;
  categoria: 1 | 2 | 3 | 4;
  info: string;
  pdf: string;
}

export interface Category {
  name: string;
  short: string;
  color: string;
  priority: number;
  description: string;
}

export const LEGENDS: Record<"all" | "1" | "2" | "3" | "4", string> = {
  all: "Every major airport, FBO, office and IS-BAH certified site — Mexico covered end to end.",
  "1": "Ground handling agents delivering full aviation support at each gateway.",
  "2": "FBO partnerships for premium fueling, maintenance, and executive amenities.",
  "3": "Corporate offices coordinating nationwide operations from regional hubs.",
  "4": "IS-BAH certified locations meeting the highest ground-handling safety standards.",
};

export const CATEGORIES: Record<"1" | "2" | "3" | "4", Category> = {
  "1": {
    name: "Manny Agent",
    short: "Agent",
    color: "#ffb900",
    priority: 1,
    description:
      "Ground handling agent locations providing full aviation support services.",
  },
  "2": {
    name: "Manny FBO Partnership",
    short: "FBO",
    color: "#e84040",
    priority: 2,
    description:
      "Fixed-base operator partnerships offering fuel, maintenance, and amenities.",
  },
  "3": {
    name: "Manny Office",
    short: "Office",
    color: "#4a90d9",
    priority: 3,
    description:
      "Manny Aero corporate offices and regional headquarters.",
  },
  "4": {
    name: "Manny IS-BAH Certified",
    short: "IS-BAH",
    color: "#f37b3a",
    priority: 4,
    description:
      "IS-BAH certified locations meeting Mexican aviation industry standards.",
  },
};

export const AIRPORTS: Airport[] = [
  { id: 1, nombre: "Benito Juárez Intl. (MEX)", lat: 19.4363, lng: -99.0721, categoria: 1, info: "Mexico City International Airport", pdf: "/docs/mex.pdf" },
  { id: 2, nombre: "Benito Juárez Intl. (MEX) — FBO", lat: 19.4363, lng: -99.0721, categoria: 2, info: "FBO Partnership at AICM", pdf: "/docs/mex-fbo.pdf" },
  { id: 3, nombre: "Benito Juárez Intl. (MEX) — IS-BAH", lat: 19.4363, lng: -99.0721, categoria: 4, info: "IS-BAH Certified Location", pdf: "/docs/mex-isbah.pdf" },
  { id: 4, nombre: "Felipe Ángeles Intl. (NLU)", lat: 19.7434, lng: -99.0157, categoria: 1, info: "AIFA — Santa Lucía, Edo. de México", pdf: "/docs/nlu.pdf" },
  { id: 5, nombre: "Toluca Intl. (TLC)", lat: 19.337, lng: -99.566, categoria: 2, info: "Licenciado A. López Mateos Intl.", pdf: "/docs/tlc.pdf" },
  { id: 6, nombre: "Toluca Intl. (TLC) — IS-BAH", lat: 19.337, lng: -99.566, categoria: 4, info: "IS-BAH Certified Location", pdf: "/docs/tlc-isbah.pdf" },
  { id: 7, nombre: "Mexico City HQ", lat: 19.427, lng: -99.1676, categoria: 3, info: "Manny Aero Headquarters", pdf: "/docs/hq.pdf" },
  { id: 8, nombre: "Cuernavaca (CVJ)", lat: 18.8348, lng: -99.261, categoria: 1, info: "Mariano Matamoros Airport", pdf: "/docs/cvj.pdf" },
  { id: 9, nombre: "Puebla Intl. (PBC)", lat: 19.1581, lng: -98.3715, categoria: 1, info: "Hermanos Serdán International", pdf: "/docs/pbc.pdf" },
  { id: 10, nombre: "Monterrey Intl. (MTY)", lat: 25.7785, lng: -100.1069, categoria: 1, info: "Gen. Mariano Escobedo Intl.", pdf: "/docs/mty.pdf" },
  { id: 11, nombre: "Monterrey (MTY) — FBO", lat: 25.7785, lng: -100.1069, categoria: 2, info: "FBO Partnership at MTY", pdf: "/docs/mty-fbo.pdf" },
  { id: 12, nombre: "Monterrey Regional Office", lat: 25.6866, lng: -100.3161, categoria: 3, info: "Manny Aero Northern Office", pdf: "/docs/mty-office.pdf" },
  { id: 13, nombre: "Del Norte Intl. (NTR)", lat: 25.8656, lng: -100.2369, categoria: 2, info: "Monterrey Del Norte — GA", pdf: "/docs/ntr.pdf" },
  { id: 14, nombre: "Saltillo (SLW)", lat: 25.5495, lng: -100.9293, categoria: 1, info: "Plan de Guadalupe International", pdf: "/docs/slw.pdf" },
  { id: 15, nombre: "Reynosa (REX)", lat: 26.0089, lng: -98.2285, categoria: 1, info: "Gen. Lucio Blanco Intl.", pdf: "/docs/rex.pdf" },
  { id: 16, nombre: "Tampico (TAM)", lat: 22.2964, lng: -97.8659, categoria: 1, info: "Gen. Francisco Javier Mina Intl.", pdf: "/docs/tam.pdf" },
  { id: 17, nombre: "Ciudad Victoria (CVM)", lat: 23.7033, lng: -98.9564, categoria: 1, info: "Gen. Pedro J. Méndez Intl.", pdf: "/docs/cvm.pdf" },
  { id: 18, nombre: "Matamoros (MAM)", lat: 25.7698, lng: -97.5253, categoria: 1, info: "Gen. Servando Canales Intl.", pdf: "/docs/mam.pdf" },
  { id: 19, nombre: "Nuevo Laredo (NLD)", lat: 27.4438, lng: -99.5705, categoria: 1, info: "Quetzalcóatl Intl.", pdf: "/docs/nld.pdf" },
  { id: 20, nombre: "Guadalajara Intl. (GDL)", lat: 20.5218, lng: -103.311, categoria: 1, info: "Miguel Hidalgo y Costilla Intl.", pdf: "/docs/gdl.pdf" },
  { id: 21, nombre: "Guadalajara (GDL) — FBO", lat: 20.5218, lng: -103.311, categoria: 2, info: "FBO Partnership at GDL", pdf: "/docs/gdl-fbo.pdf" },
  { id: 22, nombre: "Guadalajara Office", lat: 20.6597, lng: -103.3496, categoria: 3, info: "Manny Aero West Office", pdf: "/docs/gdl-office.pdf" },
  { id: 23, nombre: "Puerto Vallarta Intl. (PVR)", lat: 20.6801, lng: -105.2544, categoria: 1, info: "Lic. Gustavo Díaz Ordaz Intl.", pdf: "/docs/pvr.pdf" },
  { id: 24, nombre: "Puerto Vallarta (PVR) — FBO", lat: 20.6801, lng: -105.2544, categoria: 2, info: "FBO Partnership at PVR", pdf: "/docs/pvr-fbo.pdf" },
  { id: 25, nombre: "Bajío / León (BJX)", lat: 20.9935, lng: -101.4808, categoria: 1, info: "Del Bajío International", pdf: "/docs/bjx.pdf" },
  { id: 26, nombre: "Querétaro Intl. (QRO)", lat: 20.6173, lng: -100.1858, categoria: 2, info: "Intercontinental Querétaro", pdf: "/docs/qro.pdf" },
  { id: 27, nombre: "Querétaro (QRO) — IS-BAH", lat: 20.6173, lng: -100.1858, categoria: 4, info: "IS-BAH Certified Location", pdf: "/docs/qro-isbah.pdf" },
  { id: 28, nombre: "San Luis Potosí (SLP)", lat: 22.2543, lng: -100.9307, categoria: 1, info: "Ponciano Arriaga Intl.", pdf: "/docs/slp.pdf" },
  { id: 29, nombre: "Aguascalientes (AGU)", lat: 21.7056, lng: -102.3178, categoria: 1, info: "Jesús Terán Peredo Intl.", pdf: "/docs/agu.pdf" },
  { id: 30, nombre: "Morelia (MLM)", lat: 19.8497, lng: -101.0249, categoria: 1, info: "Gen. Francisco J. Mújica Intl.", pdf: "/docs/mlm.pdf" },
  { id: 31, nombre: "Zacatecas (ZCL)", lat: 22.8971, lng: -102.6867, categoria: 1, info: "Gen. Leobardo C. Ruiz Intl.", pdf: "/docs/zcl.pdf" },
  { id: 32, nombre: "Manzanillo (ZLO)", lat: 19.145, lng: -104.5588, categoria: 2, info: "Playa de Oro Intl.", pdf: "/docs/zlo.pdf" },
  { id: 33, nombre: "Colima (CLQ)", lat: 19.2772, lng: -103.5775, categoria: 1, info: "Lic. Miguel de la Madrid Airport", pdf: "/docs/clq.pdf" },
  { id: 34, nombre: "Tijuana Intl. (TIJ)", lat: 32.5411, lng: -116.97, categoria: 1, info: "Gen. Abelardo L. Rodríguez Intl.", pdf: "/docs/tij.pdf" },
  { id: 35, nombre: "Tijuana (TIJ) — FBO", lat: 32.5411, lng: -116.97, categoria: 2, info: "FBO Partnership at TIJ", pdf: "/docs/tij-fbo.pdf" },
  { id: 36, nombre: "Mexicali (MXL)", lat: 32.6306, lng: -115.2419, categoria: 1, info: "Gen. Rodolfo Sánchez Taboada Intl.", pdf: "/docs/mxl.pdf" },
  { id: 37, nombre: "Ensenada (ESE)", lat: 31.7953, lng: -116.6028, categoria: 1, info: "El Ciprés National Airport", pdf: "/docs/ese.pdf" },
  { id: 38, nombre: "La Paz (LAP)", lat: 24.0727, lng: -110.3625, categoria: 1, info: "Manuel Márquez de León Intl.", pdf: "/docs/lap.pdf" },
  { id: 39, nombre: "Los Cabos Intl. (SJD)", lat: 23.1518, lng: -109.7214, categoria: 2, info: "Los Cabos Intl. — FBO Partnership", pdf: "/docs/sjd.pdf" },
  { id: 40, nombre: "Los Cabos (SJD) — Agent", lat: 23.1518, lng: -109.7214, categoria: 1, info: "Ground handling agent services", pdf: "/docs/sjd-agent.pdf" },
  { id: 41, nombre: "Los Cabos (SJD) — IS-BAH", lat: 23.1518, lng: -109.7214, categoria: 4, info: "IS-BAH Certified Location", pdf: "/docs/sjd-isbah.pdf" },
  { id: 42, nombre: "Loreto (LTO)", lat: 25.9892, lng: -111.3484, categoria: 1, info: "Loreto International Airport", pdf: "/docs/lto.pdf" },
  { id: 43, nombre: "Hermosillo (HMO)", lat: 29.0959, lng: -111.0478, categoria: 1, info: "Gen. Ignacio Pesqueira García Intl.", pdf: "/docs/hmo.pdf" },
  { id: 44, nombre: "Ciudad Obregón (CEN)", lat: 27.3924, lng: -109.8331, categoria: 1, info: "Ciudad Obregón Intl.", pdf: "/docs/cen.pdf" },
  { id: 45, nombre: "Culiacán (CUL)", lat: 24.7645, lng: -107.4749, categoria: 1, info: "Bachigualato Federal Intl.", pdf: "/docs/cul.pdf" },
  { id: 46, nombre: "Mazatlán (MZT)", lat: 23.1614, lng: -106.2658, categoria: 2, info: "Gen. Rafael Buelna Intl.", pdf: "/docs/mzt.pdf" },
  { id: 47, nombre: "Los Mochis (LMM)", lat: 25.6853, lng: -109.081, categoria: 1, info: "Federal del Valle del Fuerte Intl.", pdf: "/docs/lmm.pdf" },
  { id: 48, nombre: "Chihuahua (CUU)", lat: 28.7029, lng: -105.9648, categoria: 1, info: "Gen. Roberto Fierro Villalobos Intl.", pdf: "/docs/cuu.pdf" },
  { id: 49, nombre: "Ciudad Juárez (CJS)", lat: 31.6361, lng: -106.4289, categoria: 1, info: "Abraham González Intl.", pdf: "/docs/cjs.pdf" },
  { id: 50, nombre: "Durango (DGO)", lat: 24.1247, lng: -104.5283, categoria: 1, info: "Gen. Guadalupe Victoria Intl.", pdf: "/docs/dgo.pdf" },
  { id: 51, nombre: "Torreón (TRC)", lat: 25.5683, lng: -103.4116, categoria: 1, info: "Francisco Sarabia Intl.", pdf: "/docs/trc.pdf" },
  { id: 52, nombre: "Cancún Intl. (CUN)", lat: 21.0365, lng: -86.877, categoria: 1, info: "Cancún International Airport", pdf: "/docs/cun.pdf" },
  { id: 53, nombre: "Cancún (CUN) — FBO", lat: 21.0365, lng: -86.877, categoria: 2, info: "FBO Partnership at CUN", pdf: "/docs/cun-fbo.pdf" },
  { id: 54, nombre: "Cancún (CUN) — IS-BAH", lat: 21.0365, lng: -86.877, categoria: 4, info: "IS-BAH Certified Location", pdf: "/docs/cun-isbah.pdf" },
  { id: 55, nombre: "Cancún Caribbean Office", lat: 21.1619, lng: -86.8515, categoria: 3, info: "Manny Aero Caribbean Office", pdf: "/docs/cun-office.pdf" },
  { id: 56, nombre: "Cozumel Intl. (CZM)", lat: 20.5224, lng: -86.9256, categoria: 1, info: "Cozumel International", pdf: "/docs/czm.pdf" },
  { id: 57, nombre: "Tulum Intl. (TQO)", lat: 20.4413, lng: -87.5827, categoria: 2, info: "Felipe Carrillo Puerto Intl.", pdf: "/docs/tqo.pdf" },
  { id: 58, nombre: "Tulum (TQO) — IS-BAH", lat: 20.4413, lng: -87.5827, categoria: 4, info: "IS-BAH Certified Location", pdf: "/docs/tqo-isbah.pdf" },
  { id: 59, nombre: "Chetumal (CTM)", lat: 18.5047, lng: -88.3266, categoria: 1, info: "Chetumal International", pdf: "/docs/ctm.pdf" },
  { id: 60, nombre: "Mérida (MID)", lat: 20.937, lng: -89.6577, categoria: 1, info: "Manuel Crescencio Rejón Intl.", pdf: "/docs/mid.pdf" },
  { id: 61, nombre: "Mérida (MID) — FBO", lat: 20.937, lng: -89.6577, categoria: 2, info: "FBO Partnership at MID", pdf: "/docs/mid-fbo.pdf" },
  { id: 62, nombre: "Campeche (CPE)", lat: 19.8167, lng: -90.5003, categoria: 1, info: "Ing. Alberto Acuña Ongay Intl.", pdf: "/docs/cpe.pdf" },
  { id: 63, nombre: "Villahermosa (VSA)", lat: 17.997, lng: -92.8174, categoria: 1, info: "Carlos Rovirosa Pérez Intl.", pdf: "/docs/vsa.pdf" },
  { id: 64, nombre: "Tuxtla Gutiérrez (TGZ)", lat: 16.5638, lng: -93.0224, categoria: 1, info: "Ángel Albino Corzo Intl.", pdf: "/docs/tgz.pdf" },
  { id: 65, nombre: "Palenque (PQM)", lat: 17.5333, lng: -91.9844, categoria: 1, info: "Palenque International", pdf: "/docs/pqm.pdf" },
  { id: 66, nombre: "Veracruz (VER)", lat: 19.1459, lng: -96.1873, categoria: 1, info: "Gen. Heriberto Jara Intl.", pdf: "/docs/ver.pdf" },
  { id: 67, nombre: "Poza Rica (PAZ)", lat: 20.6027, lng: -97.4608, categoria: 1, info: "El Tajín National Airport", pdf: "/docs/paz.pdf" },
  { id: 68, nombre: "Minatitlán (MTT)", lat: 18.1033, lng: -94.5808, categoria: 1, info: "Minatitlán/Coatzacoalcos Intl.", pdf: "/docs/mtt.pdf" },
  { id: 69, nombre: "Oaxaca (OAX)", lat: 17.0024, lng: -96.7267, categoria: 1, info: "Xoxocotlán International", pdf: "/docs/oax.pdf" },
  { id: 70, nombre: "Huatulco (HUX)", lat: 15.7753, lng: -96.2626, categoria: 2, info: "Bahías de Huatulco Intl.", pdf: "/docs/hux.pdf" },
  { id: 71, nombre: "Puerto Escondido (PXM)", lat: 15.8768, lng: -97.0892, categoria: 1, info: "Puerto Escondido Intl.", pdf: "/docs/pxm.pdf" },
  { id: 72, nombre: "Acapulco (ACA)", lat: 16.7571, lng: -99.7539, categoria: 1, info: "Gen. Juan N. Álvarez Intl.", pdf: "/docs/aca.pdf" },
  { id: 73, nombre: "Ixtapa-Zihuatanejo (ZIH)", lat: 17.6017, lng: -101.4608, categoria: 2, info: "Ixtapa-Zihuatanejo Intl.", pdf: "/docs/zih.pdf" },
];
