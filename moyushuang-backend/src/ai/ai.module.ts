import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 3,
    }]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule { }
