import { z } from "zod";

const COMBINING_MARKS = /[̀-ͯ]/g;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const newsInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .transform(slugify)
    .refine((s) => s.length >= 3, "Slug must be at least 3 characters"),
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(255),
  category: z.string().trim().min(1, "Category is required").max(50),
  date: z.coerce.date(),
  excerpt: z.string().trim().max(500).optional().default(""),
  body: z.string().trim().min(10, "Body must be at least 10 characters"),
  imageKey: z.string().trim().max(255).optional().default(""),
});

export type NewsInput = z.infer<typeof newsInputSchema>;
export { slugify };
