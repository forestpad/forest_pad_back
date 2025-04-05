import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { StakePoolService } from './stake-pool.service';
import { StakePoolReqDto } from './dto/stake-pool-req.dto';
import { StakePoolResDto } from './dto/stake-pool-res.dto';

@ApiTags('Stake Pool')
@Controller('v1/api/spl')
export class StakePoolController {
  constructor(private readonly stakePoolService: StakePoolService) {}

  @Post('/stake-pool/mint')
  @ApiOperation({
    summary: 'Mint Token',
    description: 'Create a new SPL token with specified metadata',
  })
  @ApiBody({
    type: StakePoolReqDto,
    description: 'Token creation request data',
  })
  @ApiResponse({
    status: 201,
    description: 'Token successfully created',
    type: StakePoolResDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  tokenMint(@Body() req: StakePoolReqDto): StakePoolResDto {
    return this.stakePoolService.tokenMint(req);
  }
}
