import axios from 'axios';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class DownloadService {
  async download(
    uri: string,
    filename: string,
    callback: () => void,
  ): Promise<void> {
    const response = await axios.get(uri, { responseType: 'stream' });
    const writer = fs.createWriteStream(filename);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
      writer.on('close', callback);
    });
  }
}
