import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { GqlAuthGuard } from '../auth/guards/auth.guards';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(GqlAuthGuard)
    @Query(() => [User], { name: 'users' })
    async getUsers() {
        return this.usersService.getUsers();
    }

    @Mutation(() => User)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
    ) {
        return this.usersService.createUser(createUserInput);
    }
}
