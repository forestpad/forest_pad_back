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
    summary: 'Issue SPL Token',
    description: 'Creates a new SPL token and sets its metadata. Returns the token address and metadata address after token issuance.',
  })
  @ApiBody({
    type: StakePoolReqDto,
    description: 'Token creation request data',
    examples: {
      example1: {
        value: {
          name: "My Token",
          symbol: "MTK",
          uri: "https://metadata.url/token.json",
          originTokenAddress: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          sellerFeeBasisPoints: 100,
          creators: "[{\"address\":\"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA\",\"share\":100}]"
        },
        description: 'Token creation request example'
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Token has been successfully created',
    type: StakePoolResDto,
    content: {
      'application/json': {
        example: {
          msg: "Token has been successfully created",
          tokenAddress: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          metadataAddress: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
          transactionId: "5KtPn1LGuxhFiwjxEqHNgHxUvuVNXKyJzXTViNpVNpw4UyQM9kKyZRctFShF6WGPuQV3fq8q9E8wJEPtGP8UNYV9"
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: ['Token name is required', 'Token symbol is required'],
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'An error occurred while creating the token',
          error: 'Internal Server Error'
        }
      }
    }
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  tokenMint(@Body() req: StakePoolReqDto): StakePoolResDto {
    return this.stakePoolService.tokenMint(req);
  }
}
