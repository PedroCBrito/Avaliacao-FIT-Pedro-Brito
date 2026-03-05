import { BookRepository } from '../repositories/BookRepository';
import { BookInput } from '../schemas/book.schemas';

export class BookService {
  constructor(private readonly repository: BookRepository) {}

  async listAll() {
    return this.repository.listAll();
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async create(data: BookInput) {
    return this.repository.create(data);
  }

  async update(id: string, data: BookInput) {
    return this.repository.update({ ...data, id });
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
