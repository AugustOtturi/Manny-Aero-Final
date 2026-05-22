export interface Phase {
  label: string;
  items: string[];
}

export interface PermitSection {
  id: string;
  badge: string;
  title: string;
  open?: boolean;
  noteBefore?: string;
  items?: string[];
  phases?: Phase[];
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
    noteBefore: "Lead time: 2 hours minimum.",
    items: [
      "Airworthiness Certificate",
      "Aircraft Registration Certificate",
      "Worldwide Insurance / Mexican Insurance",
      "LOPA (Layout of Passenger Accommodations)",
      "Private Letter (only at some airports)",
      "Noise Certificate / LOA (Letter of Authorization) / Radio License (only at some airports)",
      "Crew Licenses and Medical Certificates",
      "Gen Decs",
      "ICAO",
    ],
  },
  {
    id: "far135",
    badge: "FAR Part 135",
    title: "Charter / Air Carrier Operations",
    noteBefore: "Lead time: 3–5 hours minimum.",
    items: [
      "Airworthiness Certificate",
      "Aircraft Registration Certificate",
      "Worldwide Insurance",
      "Mexican Insurance",
      "AOC / ACC",
      "D085, Ops Specs / OST4507",
      "POA (Power of Attorney)",
      "LOPA (Layout of Passenger Accommodations)",
      "Crew Licenses and Medical Certificates",
      "Gen Decs",
      "ICAO",
    ],
  },
  {
    id: "far125",
    badge: "FAR Part 125",
    title: "FAR Part 125 / Fletamento de Pasajeros",
    items: [
      "Airworthiness Certificate",
      "Aircraft Registration",
      "Worldwide Insurance Policy",
      "Mexican Insurance Policy (commercial use)",
      "AOC",
      "ACC",
      "Charter Agreement or contract between the parties",
      "OpSpecs OT4507 o D085 con matrícula incluida",
      "AOC / Air Carrier Certificate",
      "Crew licenses approved for the aircraft to fly",
      "Crew medical certificates",
      "Flight plan or flight package",
      "GENDECs",
    ],
  },
  {
    id: "cargo",
    badge: "Cargo",
    title: "Cargo Flight",
    noteBefore: "Lead time: 15 business days.",
    items: [
      "Itinerary",
      "Final, complete route schedule",
      "Cargo Details",
      "Distribution layout",
      "Full description of goods",
      "Airway bill",
      "Aircraft Certificates",
      "Airworthiness certificate",
      "Registration certificate",
      "Worldwide insurance",
      "Mexican insurance (must specify commercial & cargo use, include payment receipt or company seal)",
      "Crew Credentials",
      "Pilot licenses (both sides of each document, showing type rating)",
      "Current medical certificates for both pilots (note: PIC medicals are valid for 6 months under this flight type)",
      "Operational Approvals",
      "Air Operator Certificate (AOC)",
      "AOC page confirming international cargo operations",
      "AFAC power of attorney letter (notarized)",
      "Charter agreement between shipper and carrier",
      "Passenger Information (if applicable)",
      "Full name, date of birth, gender, nationality",
      "Passport number, issue country, expiration date, country of residence",
    ],
  },
  {
    id: "ibp",
    badge: "Blanket",
    title: "Indefinite Blanket Permit (IBP)",
    noteBefore: "Blanket permits are the most efficient option for operators flying more than ~12 times per year into Mexico.",
    phases: [
      {
        label: "Security Manual",
        items: [
          "Company logo as an electronic file (jpg, pdf or similar) with great resolution or vectorized",
          "Complete company address",
          "Information regarding all your aircraft to be added to the permit (weight, three view draw, engine serial numbers, seat configuration, aircraft serial number, year of construction, etc.)",
          "Company organizational chart (Company Hierarchy Chart)",
          "Company directory (list of employees with phone numbers and e-mail addresses)",
          "Picture showing hangar location in home-based airport",
          "Native security manual or program approved by your aviation authority and its official authorization",
          "TFSSP approval (US operators only)",
        ],
      },
      {
        label: "Convalidación / Validation of Native AOC",
        items: [
          "Certificates of Registration of all the fleet",
          "Certificates of Airworthiness of all the fleet",
          "Noise Certificates of all the fleet",
          "D085",
          "Air Carrier Certificate or AOC (depends on the country of origin)",
          "Complete Ops Specs of all the fleet",
          "ELT Letter",
          "MELs of all the aircraft",
          "Questionnaire duly filled out",
        ],
      },
      {
        label: "Insurance Registration",
        items: [
          "Worldwide insurance policy for commercial use",
          "Mexican insurance policy for commercial use along with proof of payment",
        ],
      },
    ],
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
