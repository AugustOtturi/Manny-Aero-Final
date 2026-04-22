export interface Service {
  slug: string;
  title: string;
  href: string;
  tone: "a" | "b" | "c" | "d";
  image: string;
}

export const SERVICES: Service[] = [
  {
    slug: "permits",
    title: "Permits & Authorizations",
    href: "/services/permits",
    tone: "a",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80&auto=format&fit=crop",
  },
  {
    slug: "ground-handling",
    title: "Ground Handling Across Mexico",
    href: "/services/ground-handling",
    tone: "b",
    image:
      "https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?w=900&q=80&auto=format&fit=crop",
  },
  {
    slug: "catering",
    title: "Manny's In-flight Catering",
    href: "/services/catering",
    tone: "c",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&q=80&auto=format&fit=crop",
  },
  {
    slug: "audits",
    title: "IS-BAH & IS-BAO Audits",
    href: "/services/audits",
    tone: "d",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop",
  },
];
