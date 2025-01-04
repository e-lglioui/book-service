import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BorrowingService } from './providers/borrowing.service';
import { BorrowingController } from './controllers/borrowing.controller';
import { BorrowingRepository } from './repositories/borrowing.repository';
import { BookModule } from '../book/book.module';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Module({
  imports: [
    ConfigModule,
    BookModule,
  ],
  controllers: [BorrowingController],
  providers: [
    BorrowingService,
    BorrowingRepository,
    {
      provide: DynamoDBDocumentClient,
      useFactory: (configService: ConfigService) => {
        return configService.get('database.dynamoDBClient');
      },
      inject: [ConfigService],
    },
  ],
})
export class BorrowingModule {}
