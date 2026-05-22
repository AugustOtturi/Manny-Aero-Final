export interface NewsArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  body: string[];
  imageKey: "ibac" | "fifa" | "nbaa";
}

export const NEWS: NewsArticle[] = [
  {
    slug: "manny-joins-ibac-industry-partner-programme",
    title: "Manny Joins IBAC Industry Partner Programme",
    category: "Industry",
    date: "Jun 2026",
    excerpt:
      "Manny proudly joins the International Business Aviation Council (IBAC) Industry Partner Programme, becoming the first Mexico-based company to be part of this global initiative.",
    body: [
      "Manny proudly joins the International Business Aviation Council (IBAC) Industry Partner Programme, becoming the first Mexico-based company to be part of this global initiative.",
      "As an IS-BAH-registered organization since 2016, Manny continues strengthening its commitment to international safety standards, operational excellence, and the future of business aviation worldwide. This milestone reinforces Manny's role as a trusted aviation partner supporting operators across Mexico and beyond.",
    ],
    imageKey: "ibac",
  },
  {
    slug: "mexico-fifa-world-cup-2026",
    title: "Mexico Welcomes the World for FIFA World Cup 2026",
    category: "Operations",
    date: "Jun 2026",
    excerpt:
      "As Mexico prepares to host the FIFA World Cup 2026 alongside the United States and Canada, Manny is ready to support the increased demand for business aviation operations throughout the country.",
    body: [
      "As Mexico prepares to host the FIFA World Cup 2026 alongside the United States and Canada, Manny is ready to support the increased demand for business aviation operations throughout the country.",
      "With decades of operational expertise, nationwide coordination capabilities, and 24/7 support, Manny is prepared to deliver seamless ground handling, permits, and aviation services for operators flying into Mexico during one of the world's most important global events.",
    ],
    imageKey: "fifa",
  },
  {
    slug: "nbaa-bace-2026",
    title: "See You at NBAA-BACE 2026",
    category: "Events",
    date: "Jun 2026",
    excerpt:
      "Manny will be exhibiting at the NBAA Business Aviation Convention & Exhibition (NBAA-BACE) from October 20–22, 2026, in Las Vegas, Nevada.",
    body: [
      "Manny will be exhibiting at the NBAA Business Aviation Convention & Exhibition (NBAA-BACE) from October 20–22, 2026, in Las Vegas, Nevada.",
      "Recognized as the most influential event in business aviation, NBAA-BACE brings together industry leaders, operators, and innovators from around the world. Manny looks forward to connecting with partners and clients while continuing to strengthen relationships within the global aviation community.",
    ],
    imageKey: "nbaa",
  },
];
