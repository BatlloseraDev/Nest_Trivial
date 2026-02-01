import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService){}
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if(!authHeader) return false;

    const token = authHeader.split(' ')[1];

    try{
      const decoded = this.jwtService.verify(token);
      request.user = decoded;

      if(!requiredRoles) return true;
      return requiredRoles.some((role) => decoded.roles.includes(role));
    }catch(error){
      return false;
    }
  }
}
