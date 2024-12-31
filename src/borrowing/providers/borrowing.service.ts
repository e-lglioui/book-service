import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Borrowing } from '../schemas/borrowing.schemas';
import { Book } from '../../book/schemas/book.schema';

@Injectable()
export class BorrowingService {
  constructor(
    @InjectModel(Borrowing.name) private readonly borrowingModel: Model<Borrowing>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  async borrowBook(userId: string, bookId: string): Promise<Borrowing> {
    const book = await this.bookModel.findById(bookId);
    if (!book || book.copiesAvailable < 1) {
      throw new BadRequestException('Book not available');
    }

    const borrowing = new this.borrowingModel({
      userId,
      bookId,
      borrowDate: new Date(),
    });

    await borrowing.save();
    book.copiesAvailable -= 1;
    await book.save();

    return borrowing;
  }

  async returnBook(userId: string, bookId: string): Promise<Borrowing> {
    const borrowing = await this.borrowingModel.findOne({
      userId,
      bookId,
      returnDate: { $exists: false },
    });

    if (!borrowing) {
      throw new NotFoundException('Borrowing not found or already returned');
    }

    borrowing.returnDate = new Date();
    await borrowing.save();

    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    book.copiesAvailable += 1;
    await book.save();

    return borrowing;
  }
}
