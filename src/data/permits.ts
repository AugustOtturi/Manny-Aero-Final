export interface PermitSection {
  id: string;
  badge: string;
  title: string;
  open?: boolean;
  noteBefore?: string;
  items: string[];
  noteAfter?: string;
}

export interface DownloadItem {
  name: string;
  url: string;
  type: string;
  icon: "check" | "star" | "send" | "shield" | "plane" | "document";
}

export const PERMIT_SECTIONS: PermitSection[] = [
  {
    id: "far91",
    badge: "FAR Part 91",
    title: "Private / Non-Revenue Operations",
    open: true,
    items: [
      "Valid FAA or foreign airworthiness certificate for the aircraft.",
      "Current registration certificate issued in the state of registry.",
      "Crew licenses valid for the category and class of aircraft.",
      "Insurance certificate with minimum liability coverage meeting AFAC requirements (typically USD 300M combined single limit).",
      "Declaration of non-commercial purpose — cost-sharing and dry lease arrangements require additional documentation.",
      "Passenger manifest for each leg, filed with AFAC prior to arrival.",
    ],
    noteAfter: "FAR Part 91 permits are generally the fastest to process — approval within 24–48 hours for complete submissions.",
  },
  {
    id: "far135-single",
    badge: "FAR 135",
    title: "Single Event / Ad-Hoc Charter",
    items: [
      "FAA Air Carrier Certificate (Part 135) in good standing.",
      "Operations Specifications (OpSpecs) authorizing international operations.",
      "Aircraft-specific documentation: airworthiness, registration, and weight & balance.",
      "Proof of crew qualification for the specific routing and aircraft type.",
      "Charter contract or letter of agreement evidencing the revenue flight.",
      "Passenger list with full legal names matching travel documents.",
      "Mexican commercial insurance rider — local coverage in addition to US insurance is required for revenue ops.",
    ],
    noteBefore: "Revenue charter operations into Mexico require a distinct permit category. Plan for 5–7 business days for first-time operators.",
  },
  {
    id: "far135-foreign",
    badge: "FAR 135",
    title: "Foreign-Based Operator Authorization",
    items: [
      "Home-state Air Operator Certificate plus equivalent OpSpecs document.",
      "Bilateral Air Services Agreement confirmation between Mexico and the operator's home state.",
      "Designated Mexican in-country representative or legal agent on file with AFAC.",
      "Tax identification (RFC) registration if operations exceed the casual-frequency threshold.",
      "Historical operations record covering the past 24 months.",
      "Maintenance program reference and latest C-check documentation.",
    ],
    noteAfter: "Foreign-operator authorizations typically require a pre-application consultation with our regulatory team. We handle the full filing end-to-end.",
  },
  {
    id: "ibp",
    badge: "Blanket",
    title: "International Blanket Permit (IBP)",
    items: [
      "Operator Part 135 certificate and OpSpecs authorizing Mexican operations.",
      "Pre-registered aircraft fleet list — additions mid-cycle require amendment filing.",
      "Annual permit fee payment receipt (SHCP / Treasury direct deposit).",
      "Rolling 12-month insurance coverage that does not lapse during the permit period.",
      "Monthly flight reporting in the AFAC electronic portal.",
      "Designated compliance officer responsible for operator filings.",
    ],
    noteBefore: "Blanket permits are the most efficient option for operators flying more than ~12 times per year into Mexico. Valid 12 months with renewal option.",
    noteAfter: "IBP holders receive priority handling on amendments and in-country incident response.",
  },
  {
    id: "overflights",
    badge: "Overflight",
    title: "Overflight Authorizations",
    items: [
      "ICAO flight plan filed at least 2 hours before entering Mexican airspace.",
      "Valid insurance covering third-party liability during transit.",
      "Aircraft and crew documentation available for remote verification if requested.",
      "Hazardous materials declaration when applicable.",
      "Single-event overflight permits are free of charge; annual overflight blocks are available for frequent operators.",
    ],
    noteAfter: "Overflight permits rarely require on-the-ground support, but we facilitate urgent or last-minute filings 24/7.",
  },
];

export const DOWNLOADS: DownloadItem[] = [
  {
    name: "AFAC Permit Checklist",
    url: "#",
    type: "PDF",
    icon: "check",
  },
  {
    name: "FAR 91 Operator Template",
    url: "#",
    type: "DOCX",
    icon: "star",
  },
  {
    name: "SENEAM Flight Plan Template",
    url: "#",
    type: "PDF",
    icon: "send",
  },
  {
    name: "Insurance Declaration Sample",
    url: "#",
    type: "PDF",
    icon: "shield",
  },
  {
    name: "IBP Application Package",
    url: "#",
    type: "ZIP",
    icon: "plane",
  },
  {
    name: "Passenger Manifest Form",
    url: "#",
    type: "XLSX",
    icon: "document",
  },
];
