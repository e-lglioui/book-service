import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'The title of the book' })
  title: string;

  @ApiProperty({ description: 'The author of the book' })
  author: string;

  @ApiProperty({ description: 'The publication year of the book' })
  publicationYear: number;

  @ApiProperty({ description: 'The genre of the book' })
  genre: string;

  @ApiProperty({ description: 'The URL of the book cover image', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'The S3 key of the book cover image', required: false })
  imageKey?: string;
}