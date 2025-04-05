import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class StakePoolService {
  async update(poolAddress: string): Promise<void> {
    const scriptPath = path.join(process.cwd(), 'scripts', 'update_epoch.sh');
    
    try {
      const { stderr } = await execAsync(`/bin/bash ${scriptPath} ${poolAddress}`);
      if (stderr) {
        throw new Error(`Script execution error: ${stderr}`);
      }
    } catch (error) {
      throw new Error(`Failed to execute update script: ${error.message}`);
    }
  }
}