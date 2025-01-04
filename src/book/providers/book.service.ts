import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from '../schemas/book.schema';
import { S3Service } from '../../common/services/s3.service';
import { CreateBookDto } from '../dtos/create-book.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { BookRepository } from '../repositories/book.repository';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(createBookDto: CreateBookDto) {
    return this.bookRepository.create(createBookDto);
  }

  async findAll() {
    return this.bookRepository.findAll();
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const updatedBook = await this.bookRepository.update(id, updateBookDto);
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return updatedBook;
  }

  async remove(id: string) {
    const deletedBook = await this.bookRepository.delete(id);
    if (!deletedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return deletedBook;
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const book = await this.bookRepository.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (book.imageKey) {
      await this.s3Service.deleteFile(book.imageKey);
    }

    const { imageUrl, imageKey } = await this.s3Service.uploadFile(file);

    await this.bookRepository.update(id, { imageUrl, imageKey });

    return { imageUrl };
  }
}