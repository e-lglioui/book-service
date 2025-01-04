import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BorrowingModule } from './borrowing/borrowing.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),
    BorrowingModule,
  ],
})
export class AppModule {}
