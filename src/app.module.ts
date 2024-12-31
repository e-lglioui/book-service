import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowingModule } from './borrowing/borrowing.module';
import { Book, BookSchema } from './book/schemas/book.schema';
import { User, UserSchema } from './users/schemas/user.schemas';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/library'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
    ]),
    BorrowingModule,
  ],
})
export class AppModule {}
