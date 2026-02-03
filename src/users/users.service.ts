import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.name = createUserDto.name.toLowerCase();
      createUserDto.name = createUserDto.name.charAt(0).toUpperCase() + createUserDto.name.slice(1);
      createUserDto.email = createUserDto.email.toLowerCase();

      const {password, ...userData} = createUserDto;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);


      const userToCreate = {
        ...createUserDto,
        password: hashedPassword,
        roles: createUserDto.roles.map((role) => ({ role })),
        score: 0,
        answeredCount: 0,
      };


      const newUser = await this.userModel.create(userToCreate);
      return newUser;
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.name} ya existe`);
      }
      throw new InternalServerErrorException(`Error al crear el usuario`)
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find();
    } catch (error) {
      throw new InternalServerErrorException(`Error al obtener los usuarios`)
    }

  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userModel.findOne({id});
      if (!user) {
        throw new NotFoundException(`El usuario con id ${id} no existe`);
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`Error al obtener el usuario`)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { id: _, ...updateData } = updateUserDto;

      const dataToUpdate = {
        ...updateData,
        ...(updateData.roles ? { roles: updateData.roles.map((role) => ({ role })) } : {}),
      };

      const userUpdated = await this.userModel.findOneAndUpdate(
        { id },
        dataToUpdate,
        { new: true, runValidators: true },
      );

      if (!userUpdated) throw new NotFoundException(`El usuario con id ${id} no existe`);

      return userUpdated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`Error al actualizar el usuario`)
    }
  }

  async remove(id: number) {
    const userDeleted = await this.userModel.findByIdAndDelete(id);
    if (!userDeleted) throw new NotFoundException(`El usuario con id ${id} no existe`);
    return { message: `Usuario con ID ${id} eliminado exitosamente` };
  }



  async findEmail(email: string): Promise<User> {

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`El usuario con email ${email} no existe`);
    }
    return user;
  }


  async updateStats(id: number, correct: boolean){ 
    const scoreInc = correct ? 1 : 0;
    const answeredCountInc = 1;
    try {
      const userUpdated = await this.userModel.findOneAndUpdate(
        { id },
        { 
          $inc: { 
            score: scoreInc, 
            answeredCount: answeredCountInc 
          } 
        },
        { new: true }
      );

      if (!userUpdated) {
        throw new NotFoundException(`El usuario con id ${id} no existe`);
      }

      return userUpdated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error al actualizar las estadísticas del usuario`);
    }
    
  }



  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
