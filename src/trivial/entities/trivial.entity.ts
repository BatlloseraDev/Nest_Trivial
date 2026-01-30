import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";


@Schema({collection: 'questions'})
export class Question extends Document{
    @Prop()
    id: number;

    @Prop()
    statement: string;

    @Prop()
    options: Option[];

    @Prop()
    answerIndex: number;
}

@Schema()
export class Option {
    @Prop()
    index: number;

    @Prop()
    text: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);


// export class Option {
//     index: number;
//     text: string;
// }

// export class Question{
//     id: number;
//     statement: string;
//     options: Option[];
//     answerIndex: number;
// }


export class QuestionTried{
    id: number;
    id_q: number;
    res: number;
}