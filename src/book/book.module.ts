import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookController } from './controllers/book.controller';
import { BookService } from './providers/book.service';
import { BookRepository } from './repositories/book.repository';
import { S3Service } from '../common/services/s3.service';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Module({
  imports: [ConfigModule],
  controllers: [BookController],
  providers: [
    BookService,
    BookRepository,
    S3Service,
    {
      provide: DynamoDBDocumentClient,
      useFactory: (configService: ConfigService) => {
        return configService.get('database.dynamoDBClient');
      },
      inject: [ConfigService],
    },
  ],
  exports: [BookService],
})
export class BookModule {}
