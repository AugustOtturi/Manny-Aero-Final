export interface Service {
  slug: string;
  title: string;
  href: string;
  tone: "a" | "b" | "c" | "d";
}

export const SERVICES: Service[] = [
  {
    slug: "permits",
    title: "Permits & Authorizations",
    href: "/permits-and-authorizations",
    tone: "a",
  },
  {
    slug: "ground-handling",
    title: "Ground Handling Across Mexico",
    href: "/ground-handling",
    tone: "b",
  },
  {
    slug: "catering",
    title: "Manny's In-flight Catering",
    href: "/catering",
    tone: "c",
  },
  {
    slug: "audits",
    title: "IS-BAH & IS-BAO Audits",
    href: "/isbha",
    tone: "d",
  },
];
