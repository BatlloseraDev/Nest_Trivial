import { Module } from '@nestjs/common';
import { TrivialService } from './trivial.service';
import { TrivialController } from './trivial.controller';

@Module({
  controllers: [TrivialController],
  providers: [TrivialService],
})
export class TrivialModule {}
