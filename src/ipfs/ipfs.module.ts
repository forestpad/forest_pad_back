import { Module } from '@nestjs/common';
import { IpfsService } from './ipfs-service';

@Module({
  providers: [IpfsService],
  exports: [IpfsService], // 다른 모듈에서 사용할 수 있도록 내보내기
})
export class IpfsModule {}
