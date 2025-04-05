// src/modules/spl/services/dto/stake-pool-req.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class StakePoolReqDto {
  @ApiProperty({
    description: 'Token name',
    example: 'forest_test_sol_01',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Token symbol (ticker)',
    example: 'forestTest',
    required: true,
  })
  symbol: string;

  @ApiProperty({
    description: 'Token description',
    example: 'Forest Pad LST Token',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'Token image URL',
    example: 'https://example.com/image.png',
    required: true,
  })
  image: string;

  @ApiProperty({
    description: 'Seller fee basis points (0-10000)',
    example: 100,
    minimum: 0,
    maximum: 10000,
    required: true,
  })
  sellerFeeBasisPoints: number;

  @ApiProperty({
    description: 'Origin token address',
    example: '',
    required: false,
  })
  originTokenAddress?: string;

  @ApiProperty({
    description: 'Token creators information (JSON string)',
    example:
      '[{"address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","share":100}]',
    required: false,
  })
  creators?: string;
}
