import { z } from 'zod';

// Schema para criação
export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres" ),
  author: z.string().min(3, "O nome do autor é obrigatório"),
  published_date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  book_description: z.string().min(10)
});

// Extração automática de tipos (Interface do TypeScript)
export type BookInput = z.infer<typeof bookSchema>;