import { FastifyInstance } from 'fastify';
import { BookRepository } from '../repositories/BookRepository';
import { bookSchema } from '../schemas/book.schemas';

export async function bookRoutes(app: FastifyInstance) {
  const repository = new BookRepository();

  app.get('/books', async (_request, reply) => {
    const books = await repository.listAll();
    return reply.send(books);
  });

  app.get('/books/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const book = await repository.findById(id);

    if (!book) return reply.status(404).send({ message: 'Book not found' });

    return reply.send(book);
  });

  app.post('/books', async (request, reply) => {
    const data = bookSchema.parse(request.body);
    const book = await repository.create(data);

    return reply.status(201).send(book);
  });

  app.put('/books/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = bookSchema.parse(request.body);
    const book = await repository.update({ ...data, id });

    if (!book) return reply.status(404).send({ message: 'Book not found' });

    return reply.send(book);
  });

  app.delete('/books/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    await repository.delete(id);
    return reply.status(204).send();
  });
}