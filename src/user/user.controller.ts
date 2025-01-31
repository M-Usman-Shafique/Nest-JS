import {
  Controller,
  Post,
  Body,
  ConflictException,
  Res,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const { user, token } = await this.userService.create(createUserDto);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(201).json({ message: 'User created', user });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(409).json({ message: 'User already exists.' });
      }
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const { user, token } = await this.userService.login(
        loginUserDto.email,
        loginUserDto.password,
      );

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        return res.status(401).json({ message: error.message });
      }
      throw error;
    }
  }
}
