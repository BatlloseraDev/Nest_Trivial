import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";


@Schema({collection: 'users'})
export class User extends Document{

    @Prop({unique: true, index: true})
    id: number;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    age: number;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({required: true})
    roles: roles[];


}

@Schema()
export class roles{
    @Prop()
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('versionKey', false);