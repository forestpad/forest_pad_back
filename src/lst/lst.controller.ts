import { Controller, Get } from '@nestjs/common';
import { LstService } from './lst.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LstResponse } from './lst.types';
import { LstResponseDto } from './lst.dto';

@ApiTags('LST')
@Controller('v1/lsts')
export class LstController {
  constructor(private readonly lstService: LstService) {}

  @Get()
  @ApiOperation({ summary: 'Get all LSTs', description: 'Retrieve a list of all Liquid Staking Tokens' })
  @ApiResponse({ status: 200, description: 'List of LSTs retrieved successfully', type: LstResponseDto })
  async getLsts(): Promise<LstResponse> {
    return await this.lstService.getLsts();
  }
}