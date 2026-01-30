import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrivialDto } from './dto/create-trivial.dto';
import { UpdateTrivialDto } from './dto/update-trivial.dto';
import { Question, QuestionTried } from './entities/trivial.entity';
import { get } from 'http';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Mode } from 'fs';

@Injectable()
export class TrivialService {


  private questionsTrieds: QuestionTried[] = [];

  private score = 0;
  private answeredCount = 0;

  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<Question>) { };

  async getRandom() {
    const randomQuestion = await this.questionModel.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (!randomQuestion || randomQuestion.length === 0) {
      throw new NotFoundException('No hay preguntas disponibles');
    }

    return randomQuestion[0];
  }

  async submitAnswer(questionId: number, answerIndex: number) {
    const question = await this.questionModel.findOne({ id: questionId });

    if (!question) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    const correct = question.answerIndex === answerIndex;
    if (correct) {
      this.score++;
    }
    this.answeredCount++;
    this.questionsTrieds.push({ id: Date.now(), id_q: questionId, res: answerIndex });

    return { 
      correct, 
      correctOption: question.answerIndex, 
      id: question.id 
    };
  }

  getScore() {
    return { score: this.score, answeredCount: this.answeredCount };
  }

  reset() {
    this.score = 0;
    this.answeredCount = 0;
    this.questionsTrieds = [];
  }





    // getRandom(): Question{


    //   if(this.questions.length === 0){
    //     throw new NotFoundException('No hay preguntas disponibles');
    //   }
    //   const randomIndex = Math.floor(Math.random() * this.questions.length);
    //   const randomQuestion = this.questions[randomIndex];
    //   //this.questions.splice(randomIndex, 1);
    //   return randomQuestion;
    // }

    // submitAnswer(questionId: number, answerIndex: number){
    //   const question = this.questions.find((q) => q.id === questionId);
    //   if (!question) {
    //     throw new NotFoundException('Pregunta no encontrada');
    //   }

    //   const correct = question.answerIndex === answerIndex;
    //   if (correct) {
    //     this.score++;
    //   }
    //   this.answeredCount++;
    //   this.questionsTrieds.push({ id: question.id, id_q: questionId, res: answerIndex });


    //   return { correct, correctOption: question.answerIndex, id: question.id }
    // }

    // getScore(){
    //   return { score: this.score, answeredCount: this.answeredCount }
    // }

    // reset(){
    //   this.score = 0;
    //   this.answeredCount = 0;
    //   this.questionsTrieds = [];
    // }
  }
