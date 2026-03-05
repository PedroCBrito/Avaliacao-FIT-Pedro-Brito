import connection from "./../database/connection";

export interface Book {
  id?: string;
  title: string;
  author: string;
  published_date: string;
  book_description: string;
  created_at?: Date;
  updated_at?: Date;
}

export class BookRepository {
  async listAll() {
    return await connection('books').select('*').orderBy('created_at', 'desc');
  }

  async findById(id: string) {
    return await connection('books').where({ id }).first();
  }

  async create(data: Book) {
    const [newBook] = await connection('books').insert(data).returning('*');
    return newBook;
  }

  async update(data: Book) {
    const { id, ...bookRequest } = data;

    if (!id) throw new Error("ID is required");

    await connection('books').where({ id: id }).update(bookRequest);
    return await connection('books').where({ id: id }).first();
  }

  async delete(id: string) {
    return await connection('books').where({ id }).delete();
  }
}