import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  cognitoId: string; // ID unique de Cognito (sub)
}

export const UserSchema = SchemaFactory.createForClass(User);
