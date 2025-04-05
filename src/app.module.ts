import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { StakePoolModule } from './stake-pool/stake-pool.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    StakePoolModule,
    RewardsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
