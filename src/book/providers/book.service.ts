import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../schemas/book.schema';
import { S3Service } from '../../common/services/s3.service';
import { CreateBookDto } from '../dtos/create-book.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    private readonly s3Service: S3Service,
  ) {}

  async create(createBookDto: CreateBookDto) {
    return this.bookModel.create(createBookDto);
  }

  async findAll() {
    return this.bookModel.find().exec();
  }

  async findOne(id: string) {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return updatedBook;
  }

  async remove(id: string) {
    const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
    if (!deletedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return deletedBook;
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Supprimer l'ancienne image si elle existe
    if (book.imageKey) {
      await this.s3Service.deleteFile(book.imageKey);
    }

    // Upload la nouvelle image
    const { imageUrl, imageKey } = await this.s3Service.uploadFile(file);

    // Mettre à jour le livre avec les nouvelles informations d'image
    book.imageUrl = imageUrl;
    book.imageKey = imageKey;
    await book.save();

    return { imageUrl };
  }
}