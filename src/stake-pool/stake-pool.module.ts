import { Module } from '@nestjs/common';
import { StakePoolService } from './stake-pool.service';

@Module({
  providers: [StakePoolService],
  exports: [StakePoolService],
})
export class StakePoolModule {}