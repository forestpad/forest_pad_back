// src/modules/spl/services/stake-pool.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { StakePoolReqDto } from './dto/stake-pool-req.dto';
import { StakePoolResDto } from './dto/stake-pool-res.dto';
import * as fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import { execSync } from 'child_process';

const execAsync = promisify(exec);

@Injectable()
export class StakePoolService {
  private readonly logger = new Logger(StakePoolService.name);
  private readonly sanctumMintAuthority =
    'GRwm4EXMyVwtftQeTft7DZT3HBRxx439PrKq4oM6BwoZ';

  async update(poolAddress: string): Promise<void> {
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

  tokenMint(req: StakePoolReqDto): StakePoolResDto {
    let metadataFile: string | null = null;

    try {
      // Create metadata file
      metadataFile = this.createMetadataFile(req);

      // Log metadata file content
      const metadataContent = fs.readFileSync(metadataFile, 'utf8');
      this.logger.log(`Created metadata file content: ${metadataContent}`);
      this.logger.log(`Metadata file path: ${metadataFile}`);

      // Metaboss command
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

      // Execute process
      const output = execSync(commandStr, { encoding: 'utf8' });

      // Extract values
      const transactionId = this.extractValue(output, 'Signature: ') || '';
      const tokenAddress = this.extractValue(output, 'Mint: ') || '';
      const metadataAddress = this.extractValue(output, 'Metadata: ') || '';

      // Disable Freeze Authority
      if (tokenAddress) {
        try {
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

          // Transfer Mint Authority to Sanctum
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
      // Delete temporary metadata file
      if (metadataFile && fs.existsSync(metadataFile)) {
        try {
          fs.unlinkSync(metadataFile);
          // 임시 디렉토리도 삭제
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

  private createMetadataFile(req: StakePoolReqDto): string {
    // Create a temporary file
    const tempDir = fs.mkdtempSync(path.join(process.cwd(), 'temp-'));
    const tempFile = path.join(tempDir, `metadata-${Date.now()}.json`);

    // Metadata JSON
    const metadata = JSON.stringify(
      {
        name: req.name,
        symbol: req.symbol,
        signature: 'forest_pad_official',
        originTokenAddress: req.originTokenAddress,
        uri: req.uri,
        seller_fee_basis_points: req.sellerFeeBasisPoints,
        creators: [],
      },
      null,
      2,
    );

    // Write metadata to file
    fs.writeFileSync(tempFile, metadata);
    this.logger.log(`Metadata file created: ${tempFile}`);

    return tempFile;
  }
}
