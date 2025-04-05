// src/modules/spl/spl.module.ts
import { Module } from '@nestjs/common';
import { StakePoolController } from './stake-pool.controller';
import { StakePoolService } from './stake-pool.service';

@Module({
  controllers: [StakePoolController],
  providers: [StakePoolService],
  exports: [StakePoolService],
})
export class StakePoolModule {}
