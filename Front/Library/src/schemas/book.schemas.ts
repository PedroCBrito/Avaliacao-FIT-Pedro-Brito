import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  author: z.string().min(3, "O nome do autor é obrigatório"),
  published_date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  book_description: z.string().min(10),
  book_img: z.string().min(1, "A imagem é obrigatória"),
});

export type BookInput = z.infer<typeof bookSchema>;

// Schema para resposta da API (inclui campos gerados pelo servidor)
export const bookResponseSchema = bookSchema.extend({
  id: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Book = z.infer<typeof bookResponseSchema>;