import { Module } from '@nestjs/common';
import { TrivialService } from './trivial.service';
import { TrivialController } from './trivial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/trivial.entity';

@Module({
  controllers: [TrivialController],
  providers: [TrivialService],
  imports:[
    MongooseModule.forFeature([{
        name: Question.name,
        schema: QuestionSchema
    }])
  ]
})
export class TrivialModule {}
