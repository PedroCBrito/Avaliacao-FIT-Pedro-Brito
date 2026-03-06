import { FastifyRequest, FastifyReply } from 'fastify';
import { BookService } from '../services/BookService';
import { bookSchema } from '../schemas/book.schemas';

export class BookController {
  constructor(private readonly service: BookService) {}

  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    const books = await this.service.listAll();
    return reply.send(books);
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const id = Number(request.params.id);
    const book = await this.service.findById(id);

    if (!book) return reply.status(404).send({ message: 'Book not found' });

    return reply.send(book);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = bookSchema.parse(request.body);
    const book = await this.service.create(data);
    return reply.status(201).send(book);
  }

  async update(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const id = Number(request.params.id);
    const data = bookSchema.parse(request.body);
    const book = await this.service.update(id, data);

    if (!book) return reply.status(404).send({ message: 'Book not found' });

    return reply.send(book);
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const id = Number(request.params.id);
    await this.service.delete(id);
    return reply.status(204).send();
  }
}
