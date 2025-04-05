import { Module } from '@nestjs/common';
import { StakePoolService } from './stake-pool.service';
import { StakePoolScheduler } from './stake-pool.scheduler';

@Module({
  providers: [StakePoolService, StakePoolScheduler],
})
export class StakePoolModule {}