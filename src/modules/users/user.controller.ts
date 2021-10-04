import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
