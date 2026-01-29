import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { TrivialService } from './trivial.service';
import { CreateTrivialDto } from './dto/create-trivial.dto';
import { UpdateTrivialDto } from './dto/update-trivial.dto';
import { SubmitAnswerDTO } from './dto/submit-answer';

@Controller('trivial')
export class TrivialController {
  constructor(private readonly trivialService: TrivialService) {}

  @Get('random')
  getRandom(){
    return this.trivialService.getRandom();

  }

  @Post('answer')
  @UsePipes(new ValidationPipe({whitelist: true, transform: true}))
  submitAnswer(@Body() dto: SubmitAnswerDTO){
    return this.trivialService.submitAnswer(dto.questionId, dto.answerIndex);
  }


  @Get('score')
  getScore(){
    return this.trivialService.getScore();
  }

  @Get('reset')
  reset(){
    this.trivialService.reset();
  }
}
