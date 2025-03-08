import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async login({ email, password }: { email: string; password: string }) {
        const user = await this.usersService.getUser({ email });
        if (!user) {
            throw new NotFoundException();
        }

        const isAuthenticated = await compare(password, user.password);
        if (!isAuthenticated) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
