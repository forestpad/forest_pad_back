import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StakePoolService } from '../stake-pool/stake-pool.service';

@Injectable()
export class StakePoolScheduler {
  constructor(private readonly stakePoolService: StakePoolService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async epochCrank() {
    await this.stakePoolService.update('Zg5YBPAk8RqBR9kaLLSoN5C8Uv7nErBz1WC63HTsCPR');
  }
}