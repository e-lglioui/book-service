import { Controller, Post, Param, Body } from '@nestjs/common';
import { BorrowingService } from '../providers/borrowing.service';

@Controller('borrowings')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post('borrow/:userId/:bookId')
  async borrowBook(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.borrowingService.borrowBook(userId, bookId);
  }

  @Post('return/:userId/:bookId')
  async returnBook(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.borrowingService.returnBook(userId, bookId);
  }
}
