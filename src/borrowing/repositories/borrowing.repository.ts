import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Borrowing } from '../schemas/borrowing.schemas';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BorrowingRepository {
  private readonly tableName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly dynamoDBClient: DynamoDBDocumentClient,
  ) {
    this.tableName = this.configService.get<string>('database.tableName');
  }

  async create(borrowingData: Omit<Borrowing, 'id'>): Promise<Borrowing> {
    const borrowing: Borrowing = {
      id: uuidv4(),
      ...borrowingData,
    };

    await this.dynamoDBClient.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        ...borrowing,
        PK: `BORROWING#${borrowing.id}`,
        SK: `USER#${borrowing.userId}`,
        GSI1PK: `BOOK#${borrowing.bookId}`,
        GSI1SK: borrowing.returnDate ? 'RETURNED' : 'ACTIVE',
      },
    }));

    return borrowing;
  }

  async findActiveByUserAndBook(userId: string, bookId: string): Promise<Borrowing | null> {
    const result = await this.dynamoDBClient.send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :bookId AND GSI1SK = :status',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':bookId': `BOOK#${bookId}`,
        ':status': 'ACTIVE',
        ':userId': userId,
      },
    }));

    if (!result.Items?.[0]) return null;

    return this.mapToBorrowing(result.Items[0]);
  }

  async updateReturnDate(borrowingId: string, returnDate: string): Promise<Borrowing | null> {
    const result = await this.dynamoDBClient.send(new UpdateCommand({
      TableName: this.tableName,
      Key: {
        PK: `BORROWING#${borrowingId}`,
        SK: `USER#${borrowingId}`,
      },
      UpdateExpression: 'SET returnDate = :returnDate, GSI1SK = :status',
      ExpressionAttributeValues: {
        ':returnDate': returnDate,
        ':status': 'RETURNED',
      },
      ReturnValues: 'ALL_NEW',
    }));

    if (!result.Attributes) return null;

    return this.mapToBorrowing(result.Attributes);
  }

  private mapToBorrowing(item: Record<string, any>): Borrowing {
    return {
      id: item.id,
      userId: item.userId,
      bookId: item.bookId,
      borrowDate: item.borrowDate,
      returnDate: item.returnDate,
    };
  }
} 