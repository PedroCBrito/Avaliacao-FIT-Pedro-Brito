import { FastifyInstance } from 'fastify';
import { BookRepository } from '../repositories/BookRepository';
import { BookService } from '../services/BookService';
import { BookController } from '../controllers/BookController';

export async function bookRoutes(app: FastifyInstance) {
  const repository = new BookRepository();
  const service = new BookService(repository);
  const controller = new BookController(service);

  app.get('/books', controller.getAll.bind(controller));
  app.get('/books/:id', controller.getById.bind(controller));
  app.post('/books', controller.create.bind(controller));
  app.put('/books/:id', controller.update.bind(controller));
  app.delete('/books/:id', controller.delete.bind(controller));
}