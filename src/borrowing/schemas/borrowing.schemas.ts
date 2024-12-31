import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Borrowing extends Document {
  @Prop({ required: true }) 
  userId: string; // ID Cognito

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  bookId: Types.ObjectId;

  @Prop({ default: Date.now })
  borrowDate: Date;

  @Prop()
  returnDate: Date;
}

export const BorrowingSchema = SchemaFactory.createForClass(Borrowing);
