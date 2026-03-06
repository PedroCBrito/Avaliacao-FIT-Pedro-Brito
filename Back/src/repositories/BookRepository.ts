import connection from "./../database/connection";

export interface Book {
  id?: number;
  title: string;
  author: string;
  published_date: string;
  book_description: string;
  book_img: string; // TODO: Move image storage to an S3 bucket/CDN and store only the URL here
  created_at?: Date;
  updated_at?: Date;
}

export class BookRepository {
  async listAll() {
    return await connection('books').select('*').orderBy('created_at', 'desc');
  }

  async findById(id: number) {
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

  async delete(id: number) {
    return await connection('books').where({ id }).delete();
  }
}