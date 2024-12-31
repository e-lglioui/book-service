import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;
 
  @Prop()
  publishedYear: number;

  @Prop()
  genre: string;

  @Prop({ required: true, default: 1 })
  copiesAvailable: number;

  @Prop()
  imageUrl: string;

  @Prop()
  imageKey: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
