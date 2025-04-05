import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { LstController } from './lst.controller';
import { LstService } from './lst.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5 * 60 * 1000, // Cache for 5 minutes
      max: 100, // Maximum number of items in cache
    }),
    HttpModule,
  ],
  controllers: [LstController],
  providers: [LstService],
})
export class LstModule {}