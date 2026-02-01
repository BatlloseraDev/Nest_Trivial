import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrivialModule } from './trivial/trivial.module';
import { TrivialController } from './trivial/trivial.controller';
import { TrivialService } from './trivial/trivial.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [
           ConfigModule.forRoot({
              isGlobal: true, // Esto carga automáticamente el .env usando dotenv por dentro. Disponible en toda la app
           }),
           TrivialModule,
           UsersModule,
           MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,),
           AuthModule
          ],
  controllers: [],
  providers: [],
})
export class AppModule {}
