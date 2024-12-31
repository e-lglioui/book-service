import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../schemas/book.schema';

@Injectable()
export class BookRepository {
  constructor(@InjectModel(Book.name) private readonly bookModel: Model<Book>) {}

  async create(bookData: Partial<Book>): Promise<Book> {
    const book = new this.bookModel(bookData);
    return book.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<Book | null> {
    return this.bookModel.findById(id).exec();
  }

  async update(id: string, bookData: Partial<Book>): Promise<Book | null> {
    return this.bookModel.findByIdAndUpdate(id, bookData, { new: true }).exec();
  }

  async delete(id: string): Promise<Book | null> {
    return this.bookModel.findByIdAndDelete(id).exec();
  }
}
