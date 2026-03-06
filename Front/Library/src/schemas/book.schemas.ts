import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres" ).max(255, "O título deve ter no máximo 255 caracteres"),
  author: z.string().min(3, "O nome do autor é obrigatório").max(255, "O nome do autor deve ter no máximo 255 caracteres"),
  published_date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  book_description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres").max(5000, "A descrição deve ter no máximo 5000 caracteres"),
  book_img: z.string().min(1, "A imagem é obrigatória"),
});

export type BookInput = z.infer<typeof bookSchema>;

// Schema for the API response (includes server-generated fields)
export const bookResponseSchema = bookSchema.extend({
  id: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Book = z.infer<typeof bookResponseSchema>;