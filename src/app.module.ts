import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { StakePoolModule } from './stake-pool/stake-pool.module';
import { RewardsModule } from './rewards/rewards.module';
import { LstModule } from './lst/lst.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    StakePoolModule,
    RewardsModule,
    LstModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
