import { Module } from '@nestjs/common';
import { StakePoolScheduler } from './stake-pool.scheduler';
import { StakePoolModule } from '../stake-pool/stake-pool.module';

@Module({
  imports: [StakePoolModule],
  providers: [StakePoolScheduler],
  exports: [StakePoolScheduler],
})
export class SchedulerModule {}