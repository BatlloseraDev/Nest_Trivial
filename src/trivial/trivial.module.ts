import { Module } from '@nestjs/common';
import { TrivialService } from './trivial.service';
import { TrivialController } from './trivial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/trivial.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TrivialController],
  providers: [TrivialService],
  imports:[
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([{
        name: Question.name,
        schema: QuestionSchema
    }])
  ]
})
export class TrivialModule {}
