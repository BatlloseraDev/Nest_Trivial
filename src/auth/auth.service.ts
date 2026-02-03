import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async validateUser(email:string , password: string){
        const user = await this.usersService.findEmail(email);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if(user && await bcrypt.compare(password, user.password)){
            const { password, ...result } = user.toObject();
            return result;
        }
        throw new UnauthorizedException('Credenciales inválidas');
    }

    async login(user: any){
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
            user: user
        };
    }

}
