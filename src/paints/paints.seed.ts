import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paint } from './entities/paint.entity';
import { Model } from 'mongoose';

@Injectable()
export class PaintsSeed {
  constructor(@InjectModel(Paint.name) private paintModal: Model<Paint>) {}
  @Command({
    command: 'update:paints',
    describe: 'update paints',
  })
  async update() {
    try {
      console.log('start');
      await this.paintModal.updateMany({ views: 1000 });
      console.log('end');
    } catch (error) {
      throw error;
    }
  }
}
