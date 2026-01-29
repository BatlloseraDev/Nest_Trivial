export class Option {
    index: number;
    text: string;
}

export class Question{
    id: number;
    statement: string;
    options: Option[];
    answerIndex: number;
}


export class QuestionTried{
    id: number;
    id_q: number;
    res: number;
}