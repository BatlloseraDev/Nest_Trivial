import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Request, UseGuards } from '@nestjs/common';
import { TrivialService } from './trivial.service';
import { CreateTrivialDto } from './dto/create-trivial.dto';
import { UpdateTrivialDto } from './dto/update-trivial.dto';
import { SubmitAnswerDTO } from './dto/submit-answer';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('trivial')
export class TrivialController {
  constructor(private readonly trivialService: TrivialService) {}

  @Get('random')
  getRandom(){
    return this.trivialService.getRandom();

  }

  @Post('answer')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({whitelist: true, transform: true}))
  submitAnswer(@Request() req, @Body() dto: SubmitAnswerDTO){
    const userId = req.user.id;
    return this.trivialService.submitAnswer(userId, dto.questionId, dto.answerIndex);
    // return this.trivialService.submitAnswer(dto.questionId, dto.answerIndex);
  }


  @Get('score')
  @UseGuards(JwtGuard)
  getScore(@Request() req){
    const userId = req.user.id;
    return this.trivialService.getScore(userId);
    // return this.trivialService.getScore();
  }

  @Get('reset')
  reset(){
    this.trivialService.reset();
  }
}
