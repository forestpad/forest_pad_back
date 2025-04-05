import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RewardsService } from './rewards.service';

@Module({
  imports: [HttpModule],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}