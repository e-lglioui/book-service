import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Borrowing, BorrowingSchema } from './schemas/borrowing.schemas';
import { BorrowingService } from './providers/borrowing.service';
import { BorrowingController } from './controllers/borrowing.controller';
import { BookModule } from '../book/book.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Borrowing.name, schema: BorrowingSchema }]),
    BookModule
  ],
  controllers: [BorrowingController],
  providers: [BorrowingService],
})
export class BorrowingModule {}
