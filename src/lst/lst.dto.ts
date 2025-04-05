import { ApiProperty } from '@nestjs/swagger';
import { Lst, LstMeta, LstPool, LstResponse } from './lst.types';

class LstPoolDto implements LstPool {
  @ApiProperty({ description: 'Pool address' })
  pool: string;

  @ApiProperty({ description: 'Program address' })
  program: string;

  @ApiProperty({ description: 'Validator list address' })
  validator_list: string;

  @ApiProperty({ description: 'Vote account address', required: false })
  vote_account?: string;
}

class LstDto implements Lst {
  @ApiProperty({ description: 'Token decimals' })
  decimals: number;

  @ApiProperty({ description: 'Token logo URI' })
  logo_uri: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  meta?: LstMeta;

  @ApiProperty({ description: 'Token mint address' })
  mint: string;

  @ApiProperty({ description: 'Token name' })
  name: string;

  @ApiProperty({ type: LstPoolDto })
  pool: LstPool;

  @ApiProperty({ description: 'Token symbol' })
  symbol: string;

  @ApiProperty({ description: 'Token program address' })
  token_program: string;
}

export class LstResponseDto implements LstResponse {
  @ApiProperty({ type: [LstDto] })
  lsts: Lst[];
}