export interface ServiceDetail {
  id: string;
  name: string;
  tag: string;
  title: string;
  desc: string;
  features: string[];
  image: string;
}

export const SERVICES: ServiceDetail[] = [
  {
    id: "ground-handling",
    name: "Ground Handling",
    tag: "Ramp & FBO",
    title: "Seamless ramp operations\nacross every Mexican airport.",
    desc: "From marshaling to baggage handling, fueling coordination, lavatory servicing, and GSE provision — our ramp teams deliver consistent, ISBHA-aligned service at every airport we cover.",
    features: [
      "Aircraft marshalling, chocks, and towing",
      "Lavatory, potable water, and GPU service",
      "Baggage and cargo handling",
      "Hangar reservation and overnight parking",
      "Coordination with airport authority and tower",
    ],
    image:
      "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=1200&q=80",
  },
  {
    id: "permits",
    name: "Permits & Authorizations",
    tag: "Regulatory",
    title: "AFAC and SENEAM filings\nhandled end-to-end.",
    desc: "Landing, overflight, blanket (IBP), and special category permits filed on your behalf by a team that knows the Mexican regulatory system from the inside.",
    features: [
      "FAR 91 and FAR 135 permit filings",
      "International Blanket Permit (IBP) application and renewal",
      "Overflight authorizations — single event or annual",
      "Special operations: medical, cargo, MEDEVAC",
      "AFAC liaison and regulatory escalation",
    ],
    image:
      "https://images.unsplash.com/photo-1559600028-095166649df8?w=1200&q=80",
  },
  {
    id: "flight-planning",
    name: "Flight Planning",
    tag: "Dispatch",
    title: "Flight plans filed\nand monitored in real time.",
    desc: "ICAO flight planning, weather briefings, route optimization, and SENEAM filing — all coordinated by dispatchers who stay on the flight until the crew is in cruise.",
    features: [
      "ICAO flight plan preparation and filing",
      "SENEAM submission and confirmation",
      "Weather and NOTAM briefings",
      "Route optimization for fuel and overflight fees",
      "Real-time monitoring until flight completion",
    ],
    image:
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&q=80",
  },
  {
    id: "fuel",
    name: "Jet Fuel Facilitation",
    tag: "Fuel",
    title: "Jet A at contract rates\nat every served station.",
    desc: "Pre-arranged fuel uplifts at contract pricing across our network. We coordinate with approved fuel suppliers and provide consolidated invoicing regardless of how many stops you make.",
    features: [
      "Jet A and 100LL uplifts at 60+ airports",
      "Contract fuel pricing — no retail markup",
      "ATA 103 / JIG compliant suppliers only",
      "Single consolidated invoice per trip",
      "Fuel quality documentation on request",
    ],
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a73babd76?w=1200&q=80",
  },
  {
    id: "vip-transport",
    name: "VIP Ground Transportation",
    tag: "Concierge",
    title: "Discreet ground transport\nfrom ramp to final destination.",
    desc: "Chauffeured SUVs, armored vehicles, and executive sedans coordinated to meet the aircraft on arrival. Drivers are vetted, trained, and operate on aviation schedules — not taxi schedules.",
    features: [
      "Executive sedans, SUVs, and Sprinter vans",
      "Armored vehicle options in all major cities",
      "Vetted, English-speaking drivers",
      "Ramp-side pickup with security coordination",
      "Multi-day itinerary planning",
    ],
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80",
  },
  {
    id: "catering",
    name: "Gourmet Catering",
    tag: "Manny's Catering",
    title: "Fresh in-flight dining,\nprepared by our sister brand.",
    desc: "Manny's Catering delivers curated menus prepared fresh the morning of your flight. Dietary requirements, allergies, and cultural preferences accommodated with dedicated menu planning.",
    features: [
      "Chef-curated menus updated seasonally",
      "Dietary and allergy accommodations",
      "Fresh preparation — never frozen",
      "Delivery to aircraft 45 minutes before departure",
      "Full beverage program including fine wines",
    ],
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  },
  {
    id: "crew",
    name: "Crew Accommodation",
    tag: "Hospitality",
    title: "Crew hotels, transport,\nand rest periods managed.",
    desc: "Pre-negotiated rates at crew-friendly hotels across Mexico, with ground transport, wake-up coordination, and rest period tracking to keep your flight ops compliant.",
    features: [
      "Crew-rated hotels in all major cities",
      "Ground transport airport ↔ hotel",
      "Rest period tracking and compliance",
      "Late arrivals and early departures handled",
      "Consolidated billing through Manny Aero",
    ],
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  },
  {
    id: "full-package",
    name: "Full-Service Package",
    tag: "End-to-end",
    title: "One partner, one invoice,\neverything handled.",
    desc: "For operators who want a single point of contact across every station in Mexico. We coordinate permits, ramp, fuel, catering, transport, and crew — you receive a single itinerary and a single invoice.",
    features: [
      "Dedicated account manager 24/7",
      "All services bundled under one agreement",
      "Single consolidated invoice per trip",
      "Proactive itinerary optimization",
      "Priority handling on schedule changes",
    ],
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
  },
];
