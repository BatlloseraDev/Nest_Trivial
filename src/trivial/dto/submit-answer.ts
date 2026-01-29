import {IsInt, Min} from 'class-validator';

export class SubmitAnswerDTO{
    @IsInt()
    @Min(1)
    questionId: number;

    @IsInt()
    @Min(0)
    answerIndex: number;

}