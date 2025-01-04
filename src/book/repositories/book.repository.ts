import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Book } from '../schemas/book.schema';
import { v4 as uuidv4 } from 'uuid';
import { unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class BookRepository {
  private readonly tableName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly dynamoDBClient: DynamoDBDocumentClient,
  ) {
    this.tableName = this.configService.get<string>('database.tableName');
  }

  async create(bookData: Omit<Book, 'book_id'>): Promise<Book> {
    const book: Book = {
      book_id: uuidv4(),
      ...bookData,
    };

    await this.dynamoDBClient.send(new PutCommand({
      TableName: this.tableName,
      Item: book,
    }));

    return book;
  }

  async findAll(): Promise<Book[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const response = await this.dynamoDBClient.send(command);
    return response.Items as Book[] || [];
  }

  async findOne(id: string): Promise<Book | null> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'book_id = :book_id',
      ExpressionAttributeValues: {
        ':book_id': id
      }
    });

    const result = await this.dynamoDBClient.send(command);
    return (result.Items && result.Items[0]) as Book || null;
  }

  async update(book_id: string, bookData: Partial<Book>): Promise<Book | null> {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.entries(bookData).forEach(([key, value]) => {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    const result = await this.dynamoDBClient.send(new UpdateCommand({
      TableName: this.tableName,
      Key: { book_id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));

    return result.Attributes as Book;
  }

  async delete(book_id: string): Promise<Book | null> {
    const result = await this.dynamoDBClient.send(new DeleteCommand({
      TableName: this.tableName,
      Key: { book_id },
      ReturnValues: 'ALL_OLD',
    }));

    return result.Attributes as Book;
  }
}
