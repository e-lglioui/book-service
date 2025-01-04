import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Borrowing } from '../schemas/borrowing.schemas';
import { BookService } from '../../book/providers/book.service';
import { BorrowingRepository } from '../repositories/borrowing.repository';

@Injectable()
export class BorrowingService {
  constructor(
    private readonly borrowingRepository: BorrowingRepository,
    private readonly bookService: BookService,
  ) {}

  async borrowBook(userId: string, bookId: string): Promise<Borrowing> {
    const book = await this.bookService.findOne(bookId);
    if (!book || book.copiesAvailable< 1) {
      throw new BadRequestException('Book not available');
    }

    const borrowing = await this.borrowingRepository.create({
      userId,
      bookId,
      borrowDate: new Date().toISOString(),
    });

    await this.bookService.update(bookId, {
      copiesAvailable: book.copiesAvailable - 1,
    });

    return borrowing;
  }

  async returnBook(userId: string, bookId: string): Promise<Borrowing> {
    const borrowing = await this.borrowingRepository.findActiveByUserAndBook(userId, bookId);
    if (!borrowing) {
      throw new NotFoundException('Borrowing not found or already returned');
    }

    const updatedBorrowing = await this.borrowingRepository.updateReturnDate(
      borrowing.id,
      new Date().toISOString(),
    );

    const book = await this.bookService.findOne(bookId);
    await this.bookService.update(bookId, {
      copiesAvailable: book.copiesAvailable + 1,
    });

    return updatedBorrowing;
  }
}
