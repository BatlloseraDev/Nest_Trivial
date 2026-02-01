import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name, //Nombre de la clase del modelo: 'Usuario'.
        schema: UserSchema, //Esquema del modelo.
      },
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
