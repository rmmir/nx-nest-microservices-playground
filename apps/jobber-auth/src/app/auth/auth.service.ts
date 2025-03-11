import { Response } from 'express';
import { compare } from 'bcryptjs';

import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { environment } from '@jobber/nestjs';

import { LoginInput } from './dto/login.input';
import { TokenPayload } from './models/token-payload.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async login({ email, password }: LoginInput, response: Response) {
        const user = await this.usersService.getUser({ email });
        if (!user) {
            throw new NotFoundException();
        }

        const isAuthenticated = await compare(password, user.password);
        if (!isAuthenticated) {
            throw new UnauthorizedException();
        }

        const cookieExpiration = new Date();
        cookieExpiration.setMilliseconds(
            cookieExpiration.getTime() +
                parseInt(this.configService.getOrThrow('JWT_EXPIRATION_MS')),
        );

        const tokenPayload: TokenPayload = { userId: user.id };
        const token = this.jwtService.sign(tokenPayload);
        response.cookie('Authentication', token, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === environment.PROD,
            expires: cookieExpiration,
        });

        return user;
    }
}
