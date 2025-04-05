import { ApiProperty } from '@nestjs/swagger';

export class StakePoolReqDto {
  @ApiProperty({
    description: 'Token name',
    example: 'My Token',
    required: true
  })
  name: string;

  @ApiProperty({
    description: 'Token symbol (ticker)',
    example: 'MTK',
    required: true
  })
  symbol: string;

  @ApiProperty({
    description: 'Token metadata URI',
    example: 'https://metadata.url/token.json',
    required: true
  })
  uri: string;

  @ApiProperty({
    description: 'Original token address',
    example: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    required: true
  })
  originTokenAddress: string;

  @ApiProperty({
    description: 'Seller fee basis points (0-10000)',
    example: 100,
    minimum: 0,
    maximum: 10000,
    required: true
  })
  sellerFeeBasisPoints: number;

  @ApiProperty({
    description: 'Token creators information (JSON string)',
    example: '[{"address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","share":100}]',
    required: false
  })
  creators?: string;
}
