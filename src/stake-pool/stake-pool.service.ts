import { Injectable, Logger } from '@nestjs/common';
import { StakePoolReqDto } from './dto/stake-pool-req.dto';
import { StakePoolResDto } from './dto/stake-pool-res.dto';
import * as fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import { execSync } from 'child_process';
import { IpfsService } from '../ipfs/ipfs-service';

const execAsync = promisify(exec);

@Injectable()
export class StakePoolService {
  private readonly logger = new Logger(StakePoolService.name);
  private readonly sanctumMintAuthority =
    'GRwm4EXMyVwtftQeTft7DZT3HBRxx439PrKq4oM6BwoZ';

  constructor(private ipfsService: IpfsService) {}

  async update(poolAddress: string): Promise<void> {
    // 기존 로직 유지
    const scriptPath = path.join(process.cwd(), 'scripts', 'update_epoch.sh');

    try {
      const { stderr } = await execAsync(
        `/bin/bash ${scriptPath} ${poolAddress}`,
      );
      if (stderr) {
        throw new Error(`Script execution error: ${stderr}`);
      }
    } catch (error) {
      throw new Error(`Failed to execute update script: ${error.message}`);
    }
  }

  async tokenMint(req: StakePoolReqDto): Promise<StakePoolResDto> {
    let metadataFile: string | null = null;

    try {
      // 1. 토큰 메타데이터를 IPFS에 업로드
      const metadataUri = await this.ipfsService.uploadTokenMetadata(
        req.name,
        req.symbol,
        req.description,
        req.image,
      );

      this.logger.log(`Token metadata uploaded to IPFS: ${metadataUri}`);

      // 2. 메타보스용 메타데이터 파일 생성
      metadataFile = this.createMetadataFile({
        ...req,
        uri: metadataUri, // IPFS 메타데이터 URI
      });

      // 로그 기록
      const metadataContent = fs.readFileSync(metadataFile, 'utf8');
      this.logger.log(`Created metadata file content: ${metadataContent}`);
      this.logger.log(`Metadata file path: ${metadataFile}`);

      // 3. Metaboss 명령 실행하여 토큰 생성
      const command = [
        'metaboss',
        'create',
        'fungible',
        '--decimals',
        '9',
        '--metadata',
        metadataFile,
      ];

      const commandStr = command.join(' ');
      this.logger.log(`Executing: ${commandStr}`);

      // 프로세스 실행
      const output = execSync(commandStr, { encoding: 'utf8' });

      // 결과값 추출
      const transactionId = this.extractValue(output, 'Signature: ') || '';
      const tokenAddress = this.extractValue(output, 'Mint: ') || '';
      const metadataAddress = this.extractValue(output, 'Metadata: ') || '';

      // 4. 권한 관리
      if (tokenAddress) {
        try {
          // Freeze Authority 비활성화
          const disableFreezeCommand = [
            'spl-token',
            'authorize',
            '--disable',
            tokenAddress,
            'freeze',
          ];

          this.logger.log(
            `Disabling freeze authority: ${disableFreezeCommand.join(' ')}`,
          );
          execSync(disableFreezeCommand.join(' '), { encoding: 'utf8' });
          this.logger.log('Freeze authority disabled successfully');

          // Mint Authority를 Sanctum으로 이전
          const transferMintCommand = [
            'spl-token',
            'authorize',
            tokenAddress,
            'mint',
            this.sanctumMintAuthority,
          ];

          this.logger.log(
            `Transferring mint authority: ${transferMintCommand.join(' ')}`,
          );
          execSync(transferMintCommand.join(' '), { encoding: 'utf8' });
          this.logger.log('Mint authority transferred successfully');
        } catch (authorityError) {
          this.logger.error(
            'Failed to manage token authorities',
            authorityError,
          );
        }

        return new StakePoolResDto(
          'Token created successfully',
          tokenAddress,
          metadataAddress,
          transactionId,
        );
      }

      return new StakePoolResDto('Failed to create token');
    } catch (error) {
      this.logger.error('Error during token creation', error);
      return new StakePoolResDto(`Error: ${error.message}`);
    } finally {
      // 임시 파일 정리
      if (metadataFile && fs.existsSync(metadataFile)) {
        try {
          fs.unlinkSync(metadataFile);
          fs.rmdirSync(path.dirname(metadataFile));
        } catch (deleteError) {
          this.logger.warn(
            `Failed to delete temp file or directory: ${deleteError.message}`,
          );
        }
      }
    }
  }

  private extractValue(output: string, prefix: string): string | null {
    const line = output.split('\n').find((l) => l.trim().startsWith(prefix));
    return line ? line.substring(prefix.length).trim() : null;
  }

  private createMetadataFile(req: StakePoolReqDto & { uri: string }): string {
    // 임시 파일 생성
    const tempDir = fs.mkdtempSync(path.join(process.cwd(), 'temp-'));
    const tempFile = path.join(tempDir, `metadata-${Date.now()}.json`);

    // 메타데이터 JSON
    const metadata = JSON.stringify(
      {
        name: req.name,
        symbol: req.symbol,
        originTokenAddress: req.originTokenAddress,
        uri: req.uri, // IPFS 메타데이터 URI
        seller_fee_basis_points: req.sellerFeeBasisPoints,
        creators: req.creators ? JSON.parse(req.creators) : [],
      },
      null,
      2,
    );

    // 파일에 메타데이터 작성
    fs.writeFileSync(tempFile, metadata);
    this.logger.log(`Metadata file created: ${tempFile}`);

    return tempFile;
  }
}
