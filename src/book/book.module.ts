import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from './controllers/book.controller';
import { BookService } from './providers/book.service';
import { Book, BookSchema } from './schemas/book.schema';
import { S3Service } from '../common/services/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService, S3Service],
  exports: [BookService, MongooseModule], // Export MongooseModule for Book
})
export class BookModule {}
