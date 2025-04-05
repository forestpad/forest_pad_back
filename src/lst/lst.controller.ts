import { Controller, Get } from '@nestjs/common';
import { LstService } from './lst.service';

@Controller('v1/lsts')
export class LstController {
  constructor(private readonly lstService: LstService) {}

  @Get()
  async getLsts() {
    return await this.lstService.getLsts();
  }
}