import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUrl, Min } from 'class-validator';

export class CreateBookDto {
  // @ApiProperty({ description: 'The title of the book' })
  // @IsString()
  // book_id: string;
  @ApiProperty({ description: 'The title of the book' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The author of the book' })
  @IsString()
  author: string;

  @ApiProperty({ description: 'The publication year of the book' })
  @IsNumber()
  @Min(0)
  publishedDate: number;

  @ApiProperty({ description: 'The genre of the book' })
  @IsString()
  genre: string;

  @ApiProperty({ description: 'Number of copies available', default: 1 })
  @IsNumber()
  @Min(0)
  copiesAvailable: number;

  @ApiProperty({ description: 'The URL of the book cover image', required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ description: 'The S3 key of the book cover image', required: false })
  @IsOptional()
  @IsString()
  imageKey?: string;
}