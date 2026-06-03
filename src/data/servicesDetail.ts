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
    id: "ground-handling-fbo",
    name: "Ground Handling & FBO Coordination",
    tag: "Ground Handling",
    title: "Operational excellence on every arrival and departure",
    desc: "Reliable ground support and strategic FBO coordination for seamless operations at every destination in Mexico.",
    features: [
      "Personalized, high-quality ground handling assistance",
      "Fuel Coordination and Supervision with trusted vendors.",
      "Flight plan filing and submission",
      "FBO coordination throughout Mexico",
      "Continuous monitoring of NOTAMs affecting ground operations",
      "Services for: Diplomatic, Demonstration, Non-Scheduled Commercial / Charter, FAR Part 135, Air Ambulance, Private Non-Revenue, FAR Part 91, Military, Cargo, Experimental, etc.",
    ],
    image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=1200&q=80",
  },
  {
    id: "ground-support-equipment",
    name: "Ground Support Equipment",
    tag: "Equipment",
    title: "Reliable Ground Support Equipment & certified support for every operation",
    desc: "Access to specialized ground support equipment and professional coordination services tailored to your aircraft requirements.",
    features: [
      "Coordination of GPU, ASU, ACU, etc.",
      "Pushback and towing services with certified operators",
      "Lavatory and potable water services",
      "Passenger stairs",
      "Belt loaders",
      "In-flight Catering trucks",
      "Additional Ground support equipment upon request.",
    ],
    image: "https://images.unsplash.com/photo-1583863788434-e58a73babd76?w=1200&q=80",
  },
  {
    id: "concierge-vip",
    name: "Concierge & VIP Services",
    tag: "VIP",
    title: "Exclusive assistance beyond aviation",
    desc: "A complete VIP experience with personalized travel, security, and lifestyle coordination for passengers and crew.",
    features: [
      "VIP CIQ (Customs, Immigration & Quarantine) coordination",
      "Luxury hotel accommodations with preferred Manny rates",
      "VIP ground transportation and armored vehicles",
      "Private charter flights and helicopter arrangements",
      "Aircraft security coordination",
    ],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80",
  },
];
