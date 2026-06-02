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
    description: "Ground handling agent locations providing full aviation support services.",
  },
  "2": {
    name: "Manny FBO Partnership",
    short: "FBO Partnerships",
    color: "#e84040",
    priority: 2,
    description: "Fixed-base operator partnerships offering fuel, maintenance, and amenities.",
  },
  "3": {
    name: "Manny Office",
    short: "Office",
    color: "#4a90d9",
    priority: 3,
    description: "Manny Aero corporate offices and regional headquarters.",
  },
  "4": {
    name: "Manny IS-BAH Certified",
    short: "IS-BAH",
    color: "#f37b3a",
    priority: 4,
    description: "IS-BAH certified locations meeting Mexican aviation industry standards.",
  },
};

// 101 airports — migrated from WordPress GeoMaps (manny.aero)
// PDFs served locally from /files/airports/ (copied via download-airport-pdfs.js).
// Categories: 1=Agent (73) | 2=FBO (18) | 3=Office (8) | 4=IS-BAH (2)
export const AIRPORTS: Airport[] = [
  { id: 1,   nombre: "ACAPULCO (MMAA/ACA)",                             lat: 16.761885, lng: -99.756415,  categoria: 1, info: "", pdf: "/files/airports/MMAA-ACA.pdf" },
  { id: 2,   nombre: "AGUASCALIENTES(MMAS/AGU)",                        lat: 21.701737, lng: -102.316785, categoria: 1, info: "", pdf: "/files/airports/MMAS-AGS.pdf" },
  { id: 3,   nombre: "ALBERTO ACUÑA ONGAY (MMCP/CPE)",                  lat: 19.814569, lng: -90.503458,  categoria: 1, info: "", pdf: "/files/airports/MMCP-CPE.pdf" },
  { id: 4,   nombre: "ÁNGEL ALBINO CORZO (MMTG/TGZ)",                   lat: 16.559736, lng: -93.023080,  categoria: 1, info: "", pdf: "/files/airports/MMTG-TGZ.pdf" },
  { id: 5,   nombre: "BAHÍAS DE HUATULCO(MMBT/HUX)",                    lat: 15.771911, lng: -96.258854,  categoria: 1, info: "", pdf: "/files/airports/MMBT-HUX.pdf" },
  { id: 6,   nombre: "BENITO JUÁREZ (MMMX/MEX)",                        lat: 19.259124, lng: -99.069677,  categoria: 1, info: "", pdf: "/files/airports/MMMX-MEX.pdf" },
  { id: 7,   nombre: "CABO SAN LUCAS (MMSL/CSL)",                       lat: 22.912345, lng: -110.023846, categoria: 1, info: "", pdf: "/files/airports/MMSL-CSL.pdf" },
  { id: 8,   nombre: "CANCÚN (MMUN/CUN)",                               lat: 21.400000, lng: -86.874170,  categoria: 1, info: "", pdf: "/files/airports/MMUN-CUN.pdf" },
  { id: 9,   nombre: "CARLOS ROVIROSA (MMVA/VSA)",                      lat: 17.996242, lng: -92.817558,  categoria: 1, info: "", pdf: "/files/airports/MMVA-VSA.pdf" },
  { id: 10,  nombre: "CELAYA (MMCY/CYW)",                               lat: 20.545458, lng: -100.883467, categoria: 1, info: "", pdf: "/files/airports/MMCY-CYW.pdf" },
  { id: 11,  nombre: "CHETUMAL (MMCM/CTM)",                             lat: 18.507471, lng: -88.325904,  categoria: 1, info: "", pdf: "/files/airports/MMCM-CTM.pdf" },
  { id: 12,  nombre: "CHICHÉN ITZÁ (MMCT/CZA)",                         lat: 20.639269, lng: -88.444036,  categoria: 1, info: "", pdf: "/files/airports/MMCT-CZA.pdf" },
  { id: 13,  nombre: "CHIHUAHUA (MMCU/CUU)",                            lat: 28.704910, lng: -105.969260, categoria: 1, info: "", pdf: "/files/airports/CHIHUAHUA-MMCU-CUU2025.pdf" },
  { id: 14,  nombre: "CIUDAD DEL CARMEN (MMCE/CME)",                    lat: 18.652116, lng: -91.803465,  categoria: 1, info: "", pdf: "/files/airports/MMCE-CME.pdf" },
  { id: 15,  nombre: "CIUDAD JUÁREZ (MMCS/CJS)",                        lat: 31.636347, lng: -106.438566, categoria: 1, info: "", pdf: "/files/airports/MMCS-CJS.pdf" },
  { id: 16,  nombre: "COLIMA(MMIA/CLQ)",                                lat: 19.281373, lng: -103.577363, categoria: 1, info: "", pdf: "/files/airports/MMIA-CLQ.pdf" },
  { id: 17,  nombre: "COZUMEL (MMCZ/CZM)",                              lat: 20.511760, lng: -86.700000,  categoria: 1, info: "", pdf: "/files/airports/MMCZ-CZM.pdf" },
  { id: 18,  nombre: "CUERNAVACA(MMCB/CVJ)",                            lat: 18.537805, lng: -99.164101,  categoria: 1, info: "", pdf: "/files/airports/MMCB-CVJ.pdf" },
  { id: 19,  nombre: "CULIACÁN (MMCL/CUL)",                             lat: 24.768058, lng: -107.470001, categoria: 1, info: "", pdf: "/files/airports/MMCL-CUL.pdf" },
  { id: 20,  nombre: "DURANGO (MMDO/DGO)",                              lat: 24.126781, lng: -104.534325, categoria: 1, info: "", pdf: "/files/airports/MMDO-DGO.pdf" },
  { id: 21,  nombre: "EL LENCERO (MMJA/JAL)",                           lat: 19.477111, lng: -96.791543,  categoria: 1, info: "", pdf: "/files/airports/MMJA-JAL.pdf" },
  { id: 22,  nombre: "FELIPE ÁNGELES (MMSM/NLU)",                       lat: 19.778217, lng: -98.983350,  categoria: 1, info: "", pdf: "/files/airports/MMSM-NLU.pdf" },
  { id: 23,  nombre: "FELIPE CARRILLO (MMTL/TQO)",                      lat: 19.500000, lng: -87.658615,  categoria: 1, info: "", pdf: "/files/airports/MMTL-TQO.pdf" },
  { id: 24,  nombre: "FRANCISCO JAVIER MINA",                           lat: 22.290288, lng: -97.869566,  categoria: 1, info: "", pdf: "/files/airports/MMTM-TAM.pdf" },
  { id: 25,  nombre: "FRANCISCO SARABIA (MMTC/TRC)",                    lat: 25.563905, lng: -103.399187, categoria: 1, info: "", pdf: "/files/airports/MMTC-TRC.pdf" },
  { id: 26,  nombre: "GEN. HERIBERTO JARA (MMVR/VER)",                  lat: 19.145501, lng: -96.186571,  categoria: 1, info: "", pdf: "/files/airports/MMVR-VER.pdf" },
  { id: 27,  nombre: "GENERAL RAFAEL BUELNA (MMMZ/MTZ)",                lat: 23.167677, lng: -106.269978, categoria: 1, info: "", pdf: "/files/airports/MMMZ-MZT.pdf" },
  { id: 28,  nombre: "GENERAL SERVANDO CANALES",                        lat: 25.771556, lng: -97.530414,  categoria: 1, info: "", pdf: "/files/airports/MMMA-MAM.pdf" },
  { id: 29,  nombre: "GENERAL SERVANDO CANALES (MMMA/MAM)",             lat: 25.771556, lng: -97.530414,  categoria: 1, info: "", pdf: "/files/airports/MMMA-MAM.pdf" },
  { id: 30,  nombre: "GRAL MANUEL MÁRQUEZ DE LEÓN (MMLP/LAP)",          lat: 24.076927, lng: -110.367489, categoria: 1, info: "", pdf: "/files/airports/MMLP-LAP.pdf" },
  { id: 31,  nombre: "GRAL. ABELARDO RODRÍGUEZ (MMTJ/TIJ)",             lat: 32.540990, lng: -116.969139, categoria: 1, info: "", pdf: "/files/airports/MMTJ-TIJ.pdf" },
  { id: 32,  nombre: "GRAL. FRANCISCO J. MÚJICA(MMMM/MLM)",             lat: 19.846707, lng: -101.025906, categoria: 1, info: "", pdf: "/files/airports/MMMM-MLM.pdf" },
  { id: 33,  nombre: "GRAL. FRANCISCO JAVIER MINA (MMTM/TAM)",          lat: 22.290288, lng: -97.869566,  categoria: 1, info: "", pdf: "/files/airports/MMTM-TAM.pdf" },
  { id: 34,  nombre: "GRAL. LEOBARDO C. RUIZ (MMZC/ZCL)",               lat: 22.900567, lng: -102.680568, categoria: 1, info: "", pdf: "/files/airports/MMZC-ZCL.pdf" },
  { id: 35,  nombre: "GRAL. LIC. IGNACIO LÓPEZ RAYÓN (MMPN/UPN)",       lat: 19.397717, lng: -102.037625, categoria: 1, info: "", pdf: "/files/airports/MMPN-UPN.pdf" },
  { id: 36,  nombre: "GRAL. LUCIO BLANCO",                              lat: 26.012554, lng: -98.226585,  categoria: 1, info: "", pdf: "/files/airports/MMRX-REX.pdf" },
  { id: 37,  nombre: "GRAL. LUCIO BLANCO(MMRX/REX)",                    lat: 26.012554, lng: -98.226585,  categoria: 1, info: "", pdf: "/files/airports/MMRX-REX.pdf" },
  { id: 38,  nombre: "GRAL. RODOLFO SÁNCHEZ TABODA (MMML/MXL)",         lat: 32.628860, lng: -115.248208, categoria: 1, info: "", pdf: "/files/airports/MMML-MXL.pdf" },
  { id: 39,  nombre: "GRAL.JOSÉ MARÍA YÁNEZ (MMGM/GYM)",                lat: 27.971113, lng: -110.922462, categoria: 1, info: "", pdf: "/files/airports/MMGM-GYM.pdf" },
  { id: 40,  nombre: "GRAL.PEDRO JOSÉ MÉNDEZ",                          lat: 23.709873, lng: -98.958719,  categoria: 1, info: "", pdf: "/files/airports/MMCV-CVM.pdf" },
  { id: 41,  nombre: "GRAL.PEDRO JOSÉ MÉNDEZ (MMCV/CVM)",               lat: 23.709873, lng: -98.958719,  categoria: 1, info: "", pdf: "/files/airports/MMCV-CVM.pdf" },
  { id: 42,  nombre: "GUADALUPE(MMIO/SLW)",                             lat: 25.549701, lng: -100.931993, categoria: 1, info: "", pdf: "/files/airports/MMIO-SLW.pdf" },
  { id: 43,  nombre: "GUANAJUATO(MMLO/BJX)",                            lat: 20.994398, lng: -101.481171, categoria: 1, info: "", pdf: "/files/airports/MMLO-BJX.pdf" },
  { id: 44,  nombre: "GUERRERO NEGRO(MMGR/GUB)",                        lat: 28.027232, lng: -114.023705, categoria: 1, info: "", pdf: "/files/airports/MMGR-GUB.pdf" },
  { id: 45,  nombre: "HERMOSILLO (MMHO/HMO)",                           lat: 29.090446, lng: -111.052018, categoria: 1, info: "", pdf: "/files/airports/MMHO-HMO.pdf" },
  { id: 46,  nombre: "IXTAPA-ZIHUTANEJO (MMZH/ZIH)",                    lat: 17.606658, lng: -101.463368, categoria: 1, info: "", pdf: "/files/airports/MMZH-ZIH.pdf" },
  { id: 47,  nombre: "JOSÉ GARCI CRESPO(MMHC/TCN)",                     lat: 18.492816, lng: -97.419157,  categoria: 1, info: "", pdf: "/files/airports/MMHC-TCN.pdf" },
  { id: 48,  nombre: "LAZARO CARDENAS (MMLC/LZC)",                      lat: 17.996711, lng: -102.223164, categoria: 1, info: "", pdf: "/files/airports/MMLC-LZC.pdf" },
  { id: 49,  nombre: "LIC. ADOLFO LÓPEZ MATEOS NORMAL (MMTO/TLC)",      lat: 19.281351, lng: -99.839282,  categoria: 1, info: "", pdf: "/files/airports/MMTO-TLC-GENERAL-AV.pdf" },
  { id: 50,  nombre: "LORETO(MMLT/LTO)",                                lat: 25.993383, lng: -111.352785, categoria: 1, info: "", pdf: "/files/airports/MMLT-LTO.pdf" },
  { id: 51,  nombre: "MAR DE CORTÉS (MMPE/PPE)",                        lat: 31.351043, lng: -113.302428, categoria: 1, info: "", pdf: "/files/airports/MMPE-PPE.pdf" },
  { id: 52,  nombre: "MÉRIDA (MMMD/MID)",                               lat: 20.933458, lng: -89.661356,  categoria: 1, info: "", pdf: "/files/airports/MMMD-MID.pdf" },
  { id: 53,  nombre: "MINATITLÁN (MMMT/MTT)",                           lat: 18.103242, lng: -94.576986,  categoria: 1, info: "", pdf: "/files/airports/MMMT-MTTT.pdf" },
  { id: 54,  nombre: "MONTERREY NORTE(MMAN/NTR)",                       lat: 25.819329, lng: -100.170087, categoria: 1, info: "", pdf: "/files/airports/MMAN-NTR.pdf" },
  { id: 55,  nombre: "NOGALES (MMNG/NOG)",                              lat: 31.225346, lng: -110.974934, categoria: 1, info: "", pdf: "/files/airports/MMNG-NOG.pdf" },
  { id: 56,  nombre: "OBREGÓN (MMCN/CEN)",                              lat: 27.398601, lng: -109.833351, categoria: 1, info: "", pdf: "/files/airports/MMCN-CEN.pdf" },
  { id: 57,  nombre: "PALENQUE (MMPQ/PQM)",                             lat: 17.537959, lng: -92.015813,  categoria: 1, info: "", pdf: "/files/airports/MMPQ-PQM.pdf" },
  { id: 58,  nombre: "PIEDRAS NEGRAS (MMPG/PDS)",                       lat: 28.629840, lng: -100.544304, categoria: 1, info: "", pdf: "/files/airports/MMPG-PDS.pdf" },
  { id: 59,  nombre: "PLAYA DE ORO (MMZO/ZLO)",                         lat: 19.148606, lng: -104.559543, categoria: 1, info: "", pdf: "/files/airports/MMZO-ZLO.pdf" },
  { id: 60,  nombre: "PONCIANO ARRIAGA(MMSP/SLP)",                      lat: 22.257363, lng: -100.933292, categoria: 1, info: "", pdf: "/files/airports/MMSP-SLP.pdf" },
  { id: 61,  nombre: "PUEBLA (MMPB/PBC)",                               lat: 19.037668, lng: -98.101332,  categoria: 1, info: "", pdf: "/files/airports/MMPB-PBC.pdf" },
  { id: 62,  nombre: "PUERTO ESCONDIDO(MMPS/PXM)",                      lat: 15.875341, lng: -97.091620,  categoria: 1, info: "", pdf: "/files/airports/MMPS-PXM.pdf" },
  { id: 64,  nombre: "QUERÉTARO (MMQT/QRO)",                            lat: 20.622777, lng: -100.187272, categoria: 1, info: "", pdf: "/files/airports/MMQT-QRO.pdf" },
  { id: 65,  nombre: "QUETZALCOATL (MMNL/NLD)",                         lat: 27.450076, lng: -99.569135,  categoria: 1, info: "", pdf: "/files/airports/MMNL-NLD.pdf" },
  { id: 66,  nombre: "SAN JOSE DEL CABO(MMSD/SJD)",                     lat: 23.162891, lng: -109.491153, categoria: 1, info: "", pdf: "/files/airports/MMSD-SJD-3.pdf" },
  { id: 67,  nombre: "TAJÍN (MMPA/PAZ)",                                lat: 20.599959, lng: -97.459944,  categoria: 1, info: "", pdf: "/files/airports/MMPA-PAZ.pdf" },
  { id: 68,  nombre: "TAPACHULA (MMTP/TAP)",                            lat: 14.790838, lng: -92.369344,  categoria: 1, info: "", pdf: "/files/airports/MMTP-TAP.pdf" },
  { id: 69,  nombre: "TEPIC (MMEP/TPQ)",                                lat: 21.417222, lng: -104.839563, categoria: 1, info: "", pdf: "/files/airports/MMEP-TPQ.pdf" },
  { id: 70,  nombre: "VALLE DEL FUERTE(MMLM/LMM)",                      lat: 25.690159, lng: -109.082561, categoria: 1, info: "", pdf: "/files/airports/MMLM-LMM.pdf" },
  { id: 71,  nombre: "VENUSTIANO CARRANZA (MMMV/LOV)",                  lat: 26.955345, lng: -101.463657, categoria: 1, info: "", pdf: "/files/airports/MMMV-LOV.pdf" },
  { id: 72,  nombre: "ENSENADA (MMES/ESE)",                             lat: 31.794800, lng: -116.596000, categoria: 1, info: "", pdf: "/files/airports/MMES-ESE.pdf" },
  { id: 73,  nombre: "XOXOCOTLÁN (MMOX/OAX)",                           lat: 17.001449, lng: -96.721924,  categoria: 1, info: "", pdf: "/files/airports/MMOX-OAX.pdf" },
  { id: 74,  nombre: "AGUASCALIENTES(MMAS/AGU)",                        lat: 21.701737, lng: -102.316785, categoria: 2, info: "", pdf: "/files/airports/MMAS-AGS.pdf" },
  { id: 75,  nombre: "CABO SAN LUCAS (MMSL/CSL)",                       lat: 22.912345, lng: -110.023846, categoria: 2, info: "", pdf: "/files/airports/MMSL-CSL.pdf" },
  { id: 76,  nombre: "CANCÚN (MMUN/CUN)",                               lat: 21.400000, lng: -86.874170,  categoria: 2, info: "", pdf: "/files/airports/MMUN-CUN.pdf" },
  { id: 78,  nombre: "FELIPE ÁNGELES (MMSM/NLU)",                       lat: 19.778217, lng: -98.983350,  categoria: 2, info: "", pdf: "/files/airports/MMSM-NLU.pdf" },
  { id: 79,  nombre: "FELIPE CARRILLO (MMTL/TQO)",                      lat: 19.500000, lng: -87.658615,  categoria: 2, info: "", pdf: "/files/airports/MMTL-TQO.pdf" },
  { id: 80,  nombre: "FRANCISCO JAVIER MINA",                           lat: 22.290288, lng: -97.869566,  categoria: 2, info: "", pdf: "/files/airports/MMTM-TAM.pdf" },
  { id: 81,  nombre: "FRANCISCO SARABIA (MMTC/TRC)",                    lat: 25.563905, lng: -103.399187, categoria: 2, info: "", pdf: "/files/airports/MMTC-TRC.pdf" },
  { id: 82,  nombre: "GRAL. FRANCISCO JAVIER MINA (MMTM/TAM)",          lat: 22.290288, lng: -97.869566,  categoria: 2, info: "", pdf: "/files/airports/MMTM-TAM.pdf" },
  { id: 83,  nombre: "GUANAJUATO(MMLO/BJX)",                            lat: 20.994398, lng: -101.481171, categoria: 2, info: "", pdf: "/files/airports/MMLO-BJX.pdf" },
  { id: 84,  nombre: "LIC. ADOLFO LÓPEZ MATEOS NORMAL (MMTO/TLC)",      lat: 19.281351, lng: -99.839282,  categoria: 2, info: "", pdf: "/files/airports/MMTO-TLC-GENERAL-AV.pdf" },
  { id: 85,  nombre: "LORETO(MMLT/LTO)",                                lat: 25.993383, lng: -111.352785, categoria: 2, info: "", pdf: "/files/airports/MMLT-LTO.pdf" },
  { id: 86,  nombre: "MÉRIDA (MMMD/MID)",                               lat: 20.933458, lng: -89.661356,  categoria: 2, info: "", pdf: "/files/airports/MMMD-MID.pdf" },
  { id: 87,  nombre: "MONTERREY NORTE(MMAN/NTR)",                       lat: 25.819329, lng: -100.170087, categoria: 2, info: "", pdf: "/files/airports/MMAN-NTR.pdf" },
  { id: 88,  nombre: "PUEBLA (MMPB/PBC)",                               lat: 19.037668, lng: -98.101332,  categoria: 2, info: "", pdf: "/files/airports/MMPB-PBC.pdf" },
  { id: 89,  nombre: "PUERTO VALLARTA (MMPR/PVR)",                      lat: 20.681000, lng: -105.252290, categoria: 2, info: "", pdf: "/files/airports/MMPR-PVR.pdf" },
  { id: 90,  nombre: "QUERÉTARO (MMQT/QRO)",                            lat: 20.622777, lng: -100.187272, categoria: 2, info: "", pdf: "/files/airports/MMQT-QRO.pdf" },
  { id: 91,  nombre: "SAN JOSE DEL CABO(MMSD/SJD)",                     lat: 23.162891, lng: -109.491153, categoria: 2, info: "", pdf: "/files/airports/MMSD-SJD-3.pdf" },
  { id: 102, nombre: "GUADALAJARA (MMGL/GDL)",                          lat: 20.521760, lng: -103.310696, categoria: 2, info: "", pdf: "/files/airports/MMGL-GDL.pdf" },
  { id: 92,  nombre: "CANCÚN (MMUN/CUN)",                               lat: 21.400000, lng: -86.874170,  categoria: 3, info: "", pdf: "/files/airports/MMUN-CUN.pdf" },
  { id: 93,  nombre: "COZUMEL (MMCZ/CZM)",                              lat: 20.511760, lng: -86.700000,  categoria: 3, info: "", pdf: "/files/airports/MMCZ-CZM.pdf" },
  { id: 95,  nombre: "FELIPE CARRILLO (MMTL/TQO)",                      lat: 19.500000, lng: -87.658615,  categoria: 3, info: "", pdf: "/files/airports/MMTL-TQO.pdf" },
  { id: 96,  nombre: "LIC. ADOLFO LÓPEZ MATEOS NORMAL (MMTO/TLC)",      lat: 19.281351, lng: -99.839282,  categoria: 3, info: "", pdf: "/files/airports/MMTO-TLC-GENERAL-AV.pdf" },
  { id: 97,  nombre: "MÉRIDA (MMMD/MID)",                               lat: 20.933458, lng: -89.661356,  categoria: 3, info: "", pdf: "/files/airports/MMMD-MID.pdf" },
  { id: 98,  nombre: "QUERÉTARO (MMQT/QRO)",                            lat: 20.622777, lng: -100.187272, categoria: 3, info: "", pdf: "/files/airports/MMQT-QRO.pdf" },
  { id: 99,  nombre: "TAPACHULA(MMTP/TAP)",                             lat: 14.790298, lng: -92.369344,  categoria: 3, info: "", pdf: "/files/airports/MMTP-TAP.pdf" },
  { id: 103, nombre: "GUADALAJARA (MMGL/GDL)",                          lat: 20.521760, lng: -103.310696, categoria: 3, info: "", pdf: "/files/airports/MMGL-GDL.pdf" },
  { id: 100, nombre: "LIC. ADOLFO LÓPEZ MATEOS NORMAL (MMTO/TLC)",      lat: 19.281351, lng: -99.839282,  categoria: 4, info: "", pdf: "/files/airports/MMTO-TLC-GENERAL-AV.pdf" },
  { id: 101, nombre: "QUERÉTARO (MMQT/QRO)",                            lat: 20.622777, lng: -100.187272, categoria: 4, info: "", pdf: "/files/airports/MMQT-QRO.pdf" },
];
