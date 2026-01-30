import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrivialModule } from './trivial/trivial.module';
import { TrivialController } from './trivial/trivial.controller';
import { TrivialService } from './trivial/trivial.service';
import { UsersModule } from './users/users.module';



@Module({
  imports: [
           ConfigModule.forRoot({
              isGlobal: true, // Esto carga automáticamente el .env usando dotenv por dentro. Disponible en toda la app
           }),
           TrivialModule,
           UsersModule,
           
          ],
  controllers: [TrivialController],
  providers: [TrivialService],
})
export class AppModule {}
